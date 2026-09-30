#!/usr/bin/env bash
# Pulls shadcn/ui's real source for components into .shadcn/<name>/ (git-ignored),
# to research before building the ParseUI version. See design/DESIGN.md.
#
#   npm run shadcn -- badge dialog          # one or more component names
#   SHADCN_STYLE=radix-nova npm run shadcn -- badge
#
# Writes per component:
#   <file>.tsx      the component source (base-nova style — what shadcn's docs render)
#   examples.tsx    the source of every example on its docs page
#   registry.json   the raw registry item (dependencies, other files)
#   links.txt       docs page + examples URL, and registry dependencies
set -euo pipefail

[ $# -gt 0 ] || { echo "Usage: npm run shadcn -- <component> [component…]" >&2; exit 1; }
cd "$(dirname "$0")/.."
STYLE="${SHADCN_STYLE:-base-nova}"
OUT=".shadcn"

for name in "$@"; do
  dir="$OUT/$name"
  mkdir -p "$dir"
  echo "==> $name ($STYLE)"

  # 1. Component source, via the shadcn CLI.
  npx --yes shadcn@latest view "https://ui.shadcn.com/r/styles/$STYLE/$name.json" > "$dir/registry.json"

  # 2. Split the files out, and note links + dependencies.
  examples=$(node -e '
    const fs = require("fs"), path = require("path");
    const [dir] = process.argv.slice(1);
    const item = [].concat(JSON.parse(fs.readFileSync(path.join(dir, "registry.json"), "utf8")))[0];
    for (const f of item.files ?? []) fs.writeFileSync(path.join(dir, path.basename(f.path)), f.content ?? "");
    const links = item.meta?.links ?? {};
    fs.writeFileSync(path.join(dir, "links.txt"), [
      `docs: ${links.docs ?? "-"}`,
      `examples: ${links.examples ?? "-"}`,
      `registry dependencies: ${(item.registryDependencies ?? []).join(", ") || "-"}`,
      `npm dependencies: ${(item.dependencies ?? []).join(", ") || "-"}`,
    ].join("\n") + "\n");
    process.stdout.write(links.examples ?? "");
  ' "$dir")

  # 3. The examples shown on its docs page.
  if [ -n "$examples" ]; then
    curl -sfL --max-time 30 "$examples" -o "$dir/examples.tsx" || echo "   (couldn't fetch examples: $examples)"
  fi

  ls "$dir" | sed 's/^/   /'
done
