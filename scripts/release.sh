#!/usr/bin/env bash
# Releases ParseUI from the server: GitHub → build → CDN → npm.
#
#   CDN_ROOT=/var/www/cdn.parseui.com bash scripts/release.sh --dry-run   # rehearse
#   CDN_ROOT=/var/www/cdn.parseui.com bash scripts/release.sh             # release
#
# Environment:
#   CDN_ROOT     folder the web server serves as https://cdn.parseui.com (required)
#   CDN_URL      public URL of that folder (default https://cdn.parseui.com)
#   SKIP_PULL=1  release the checked-out code without `git pull`
#   SKIP_NPM=1   stop after the CDN (steps 1–5)
#
# The CDN step must succeed before npm: the npm package loads
# ${CDN_URL}/<version>/parseui.min.js, so publishing first would point new
# installs at a file that isn't there. CDN versions are immutable — the
# script refuses to overwrite a published version with different files.
set -euo pipefail

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

: "${CDN_ROOT:?Set CDN_ROOT to the folder served as https://cdn.parseui.com}"
CDN_URL="${CDN_URL:-https://cdn.parseui.com}"
cd "$(dirname "$0")/.."

step() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
run() { if [ "$DRY_RUN" = 1 ]; then echo "[dry-run] $*"; else "$@"; fi; }
fail() { echo "✗ $*" >&2; exit 1; }

step "1/6 Update the code from GitHub"
if [ "${SKIP_PULL:-0}" != 1 ]; then
  [ -z "$(git status --porcelain)" ] || fail "The server's checkout has local changes — discard them (git checkout -- . && git clean -fd) first."
  git pull --ff-only
fi
git log -1 --oneline

step "2/6 Install dependencies"
npm ci

step "3/6 Build and type-check"
npm run build
npm run typecheck

VERSION=$(node -p "require('./packages/parseui/package.json').version")
ICONS_VERSION=$(node -p "require('./packages/icons/package.json').version")
echo "parseui $VERSION · @parseui/icons $ICONS_VERSION"

step "4/6 Copy to the CDN folder ($CDN_ROOT)"
STAGE=".release"
rm -rf "$STAGE"
mkdir -p "$STAGE/$VERSION" "$STAGE/icons/$ICONS_VERSION"
cp packages/parseui/dist/cdn/* "$STAGE/$VERSION/"
cp packages/icons/dist/svg/*.svg packages/icons/dist/icons.json "$STAGE/icons/$ICONS_VERSION/"

# stage-dir → CDN dir, once. An existing identical folder is fine (re-run);
# an existing different one means the version wasn't bumped.
to_cdn() {
  local src=$1 dest=$2
  if [ -e "$dest" ]; then
    if diff -rq "$src" "$dest" >/dev/null; then
      echo "Already on the CDN, unchanged: $dest"
      return
    fi
    fail "$dest already exists with different files. CDN versions are immutable — bump the version in package.json."
  fi
  run mkdir -p "$dest"
  run cp -R "$src/." "$dest/"
  echo "Copied → $dest"
}
to_cdn "$STAGE/$VERSION" "$CDN_ROOT/$VERSION"
to_cdn "$STAGE/icons/$ICONS_VERSION" "$CDN_ROOT/icons/$ICONS_VERSION"

step "5/6 Check the CDN serves them"
check() {
  local url=$1 code
  code=$(curl -s -o /dev/null -w '%{http_code}' "$url")
  [ "$code" = 200 ] || fail "$url → HTTP $code. Fix the web server before publishing to npm."
  echo "200 $url"
}
if [ "$DRY_RUN" = 1 ]; then
  echo "[dry-run] would check $CDN_URL/$VERSION/parseui.min.js and $CDN_URL/icons/$ICONS_VERSION/icons.json"
else
  check "$CDN_URL/$VERSION/parseui.min.js"
  check "$CDN_URL/icons/$ICONS_VERSION/icons.json"
  check "$CDN_URL/icons/$ICONS_VERSION/$(ls packages/icons/dist/svg | head -1)"
fi

if [ "${SKIP_NPM:-0}" = 1 ]; then
  rm -rf "$STAGE"
  step "Done (CDN only — SKIP_NPM=1)"
  exit 0
fi

step "6/6 Publish to npm"
if ! npm whoami >/dev/null 2>&1; then
  [ "$DRY_RUN" = 1 ] && echo "(not logged in to npm — fine for a dry run)" || fail "Not logged in to npm on this server — see RELEASING.md (npm token)."
fi
publish() {
  local workspace=$1 name=$2 version=$3
  if npm view "$name@$version" version >/dev/null 2>&1; then
    echo "$name@$version is already on npm — skipping."
    return
  fi
  if [ "$DRY_RUN" = 1 ]; then
    npm publish --workspace="$workspace" --access public --dry-run
  else
    npm publish --workspace="$workspace" --access public
  fi
}
# Icons first: nothing in parseui's npm package depends on it, but a failed
# @parseui scope (missing npm org) is better found before parseui ships.
publish @parseui/icons @parseui/icons "$ICONS_VERSION"
publish parseui parseui "$VERSION"

rm -rf "$STAGE"
step "Done"
echo "CDN: $CDN_URL/$VERSION/parseui.min.js"
echo "npm: https://www.npmjs.com/package/parseui/v/$VERSION"
