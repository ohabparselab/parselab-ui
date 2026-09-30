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
# Two kinds of CDN folders:
#   <version>/       pinned, immutable — the script refuses to overwrite one
#                    with different files (bump the version instead)
#   v<major>/        the channel — updated to every release of that major, so
#                    a fix reaches every site on the channel at once (npm
#                    installs included: the loader loads the channel). Holds a
#                    VERSION file; never moved backwards to an older release.
# Icons follow the same scheme under icons/.
#
# The CDN step must succeed before npm: pinned npm installs load
# ${CDN_URL}/<version>/parseui.min.js, so publishing first would point them at
# a file that isn't there.
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

# stage-dir → channel dir (v<major>/), overwritten in place.
newer_or_equal() { # $1 >= $2 (semver, numeric parts)
  node -e 'const [a,b]=process.argv.slice(1).map(v=>v.split(/[.-]/).map(Number));for(let i=0;i<3;i++){if((a[i]||0)!==(b[i]||0))process.exit((a[i]||0)>(b[i]||0)?0:1)}process.exit(0)' "$1" "$2"
}
to_channel() {
  local src=$1 dest=$2 version=$3 current=""
  [ -f "$dest/VERSION" ] && current=$(cat "$dest/VERSION")
  if [ -n "$current" ] && ! newer_or_equal "$version" "$current"; then
    echo "Channel $dest has $current (newer than $version) — left as is."
    return
  fi
  if [ "$current" = "$version" ] && diff -rq -x VERSION "$src" "$dest" >/dev/null 2>&1; then
    echo "Channel already on $version: $dest"
    return
  fi
  run mkdir -p "$dest"
  run cp -R "$src/." "$dest/"
  if [ "$DRY_RUN" != 1 ]; then
    # Drop files this release doesn't have (e.g. a removed icon), then mark the version.
    for file in "$dest"/*; do
      name=$(basename "$file")
      [ "$name" = VERSION ] || [ -e "$src/$name" ] || rm -f "$file"
    done
    echo "$version" > "$dest/VERSION"
  fi
  echo "Channel → $dest now serves $version${current:+ (was $current)}"
}
to_channel "$STAGE/$VERSION" "$CDN_ROOT/v${VERSION%%.*}" "$VERSION"
to_channel "$STAGE/icons/$ICONS_VERSION" "$CDN_ROOT/icons/v${ICONS_VERSION%%.*}" "$ICONS_VERSION"

step "5/6 Check the CDN serves them"
check() {
  local url=$1 code
  code=$(curl -s -o /dev/null -w '%{http_code}' "$url")
  [ "$code" = 200 ] || fail "$url → HTTP $code. Fix the web server before publishing to npm."
  echo "200 $url"
}
check_channel() { # the channel's VERSION, bypassing caches
  local url=$1 want=$2 got
  got=$(curl -s "$url/VERSION?t=$(date +%s)" | tr -d '[:space:]')
  newer_or_equal "$got" "$want" 2>/dev/null || fail "$url serves ${got:-nothing}, expected $want."
  echo "OK  $url → $got"
}
if [ "$DRY_RUN" = 1 ]; then
  echo "[dry-run] would check $CDN_URL/$VERSION/, $CDN_URL/v${VERSION%%.*}/ and the icon folders"
else
  check "$CDN_URL/$VERSION/parseui.min.js"
  check "$CDN_URL/v${VERSION%%.*}/parseui.min.js"
  check_channel "$CDN_URL/v${VERSION%%.*}" "$VERSION"
  check "$CDN_URL/icons/$ICONS_VERSION/icons.json"
  check "$CDN_URL/icons/$ICONS_VERSION/$(ls packages/icons/dist/svg | head -1)"
  check_channel "$CDN_URL/icons/v${ICONS_VERSION%%.*}" "$ICONS_VERSION"
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
echo "CDN: $CDN_URL/v${VERSION%%.*}/parseui.min.js (channel) · $CDN_URL/$VERSION/parseui.min.js (pinned)"
echo "npm: https://www.npmjs.com/package/parseui/v/$VERSION"
