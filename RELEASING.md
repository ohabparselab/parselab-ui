# Releasing ParseUI

Code goes to GitHub; the server pulls it, builds, puts the library on the CDN, then publishes to npm. The npm package is only a loader for the CDN file, so **the CDN always comes first** — `scripts/release.sh` enforces that order.

```
your machine ──git push──▶ GitHub ──git pull──▶ server ──▶ cdn.parseui.com/<version>/  (pinned, frozen)
                                                       ├─▶ cdn.parseui.com/v<major>/ (channel: every site updates)
                                                       └─▶ npm: @parseui/icons, parseui
```

## How one change reaches every site

Sites and npm apps load the **channel** (`/v1/`) by default — the npm package is only a loader for it. So a fix is one release away from every site:

1. Bump the **patch** (or minor) version — `1.0.0` → `1.0.1` — and push.
2. Run the release on the server. It writes the pinned `1.0.1/` folder and replaces `v1/` with 1.0.1.
3. Every site on `/v1/` — plain HTML and npm alike — runs 1.0.1 within the channel's cache time (5 minutes below). No site has to change anything, and npm apps don't reinstall.

A **breaking** change bumps the **major** version (`2.0.0`): it starts a new `/v2/` channel, and sites on `/v1/` keep working untouched until they choose to move. Sites that want no automatic updates at all use a pinned URL (`/1.0.1/…`, or `load({ pin: true })` with npm).

The npm package only needs a new publish when the loader or the TypeScript types change; `SKIP_NPM=1` releases to the CDN alone.

What gets published:

| Where | Path | From |
|---|---|---|
| CDN, pinned | `https://cdn.parseui.com/<version>/parseui.min.js` (+ `.map`) — never changes | `packages/parseui/dist/cdn/` |
| CDN, channel | `https://cdn.parseui.com/v<major>/parseui.min.js` — replaced by every release of that major | same |
| CDN | `https://cdn.parseui.com/icons/<version>/…` and `/icons/v<major>/…` (`<name>.svg`, `icons.json`) | `packages/icons/dist/` |
| npm | `parseui` (loader + types) | `packages/parseui` |
| npm | `@parseui/icons` | `packages/icons` |

## One-time setup

### npm (on npmjs.com)

1. Create the organization **`parseui`** — it owns the `@parseui` scope. Without it `@parseui/icons` can't be published.
2. Create a **granular access token**: read and write for `parseui` and `@parseui/icons` (or the `parseui` org), with "bypass two-factor authentication" enabled so the server can publish unattended.

### Server

1. Node.js 20 or newer, git, curl, and a web server (nginx below).
2. Give the server read access to the repo (a GitHub deploy key), then clone it:

   ```bash
   git clone git@github.com:ohabparselab/parselab-ui.git /opt/parselab-ui
   ```

3. Store the npm token for the user that runs releases (never commit it):

   ```bash
   npm config set //registry.npmjs.org/:_authToken <token>
   npm whoami   # should print the npm account
   ```

4. Create the CDN folder, point DNS for `cdn.parseui.com` at the server, and serve the folder over HTTPS (e.g. `certbot --nginx -d cdn.parseui.com`):

   ```bash
   sudo mkdir -p /var/www/cdn.parseui.com
   sudo chown "$USER" /var/www/cdn.parseui.com
   ```

   ```nginx
   server {
     listen 443 ssl http2;
     server_name cdn.parseui.com;
     root /var/www/cdn.parseui.com;
     # ssl_certificate … (added by certbot)

     # Channels (/v1/, /icons/v1/) change with every release: cache briefly,
     # so an update reaches every site within ~5 minutes.
     location ~ ^/(icons/)?v[0-9]+/ {
       add_header Cache-Control "public, max-age=300, stale-while-revalidate=3600" always;
       add_header Access-Control-Allow-Origin "*" always;
       add_header X-Content-Type-Options "nosniff" always;
       try_files $uri =404;
     }

     # Pinned versions (/1.0.1/, /icons/1.0.0/) never change: cache forever.
     location / {
       add_header Cache-Control "public, max-age=31536000, immutable" always;
       add_header Access-Control-Allow-Origin "*" always;
       add_header X-Content-Type-Options "nosniff" always;
       try_files $uri =404;
     }
   }
   ```

   nginx's default `mime.types` already serves `.js`, `.svg` and `.json` with the right types.

## Every release

### 1. On your machine: bump the versions, push

A published version can never change — on the CDN or on npm — so every release needs a new version.

```bash
npm version patch --workspace=parseui --no-git-tag-version          # 1.0.0 → 1.0.1 (or minor / major)
npm version patch --workspace=@parseui/icons --no-git-tag-version   # only if icons changed
npm install                                                          # updates package-lock.json
npm run build && npm run typecheck
git commit -am "Release parseui 1.0.1"
git push
```

Bumping `@parseui/icons` automatically moves `<i icon>` to the new icon folder on the CDN — the build reads the version from `packages/icons/package.json`.

### 2. On the server: rehearse, then release

```bash
cd /opt/parselab-ui
CDN_ROOT=/var/www/cdn.parseui.com npm run release -- --dry-run   # nothing is written or published
CDN_ROOT=/var/www/cdn.parseui.com npm run release
```

The script:

1. `git pull --ff-only` (stops if the server's checkout has local changes)
2. `npm ci`
3. `npm run build` and `npm run typecheck`
4. copies the files into the pinned `$CDN_ROOT/<version>/` and `$CDN_ROOT/icons/<version>/` — and **stops** if that version already exists with different files (you forgot to bump) — then replaces the channels `$CDN_ROOT/v<major>/` and `$CDN_ROOT/icons/v<major>/` (never with an older version than they hold)
5. checks `https://cdn.parseui.com/…` answers 200 for the new files and that each channel's `VERSION` is the new one — and **stops** before npm if not
6. `npm publish` for `@parseui/icons`, then `parseui` — skipping any version that's already on npm

Options: `SKIP_PULL=1` releases the checked-out code as is; `SKIP_NPM=1` stops after the CDN; `CDN_URL=…` checks a different public URL.

### 3. Check

```bash
curl -I https://cdn.parseui.com/1.0.1/parseui.min.js
curl https://cdn.parseui.com/v1/VERSION        # the channel's current release
npm view parseui version
```

## If something goes wrong

- **The script stopped** — nothing after the failing step ran; fix the cause and run it again. Finished steps are skipped (same files already on the CDN, versions already on npm).
- **A bad version reached the channel** — every site on `/v1/` has it, so roll the channel back first (pinned folders are never touched), then fix forward with a new patch:

  ```bash
  cp -R /var/www/cdn.parseui.com/1.0.0/. /var/www/cdn.parseui.com/v1/ && echo 1.0.0 > /var/www/cdn.parseui.com/v1/VERSION
  ```

  Sites pick the rollback up within the channel cache time. If the bad version was also published to npm: `npm deprecate parseui@<bad version> "Use <new version>"`.
- Because a channel release reaches everyone at once, always run `--dry-run` first, and check the new build on the examples page / docs before releasing.
