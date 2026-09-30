# Releasing ParseUI

Code goes to GitHub; the server pulls it, builds, puts the library on the CDN, then publishes to npm. The npm package is only a loader for the CDN file, so **the CDN always comes first** — `scripts/release.sh` enforces that order.

```
your machine ──git push──▶ GitHub ──git pull──▶ server ──▶ cdn.parseui.com/<version>/parseui.min.js
                                                       └─▶ npm: @parseui/icons, parseui
```

What gets published:

| Where | Path | From |
|---|---|---|
| CDN | `https://cdn.parseui.com/<parseui version>/parseui.min.js` (+ `.map`) | `packages/parseui/dist/cdn/` |
| CDN | `https://cdn.parseui.com/icons/<icons version>/<name>.svg`, `icons.json` | `packages/icons/dist/` |
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

     location / {
       # Every path contains a version, so files never change: cache forever.
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
4. copies the files into `$CDN_ROOT/<version>/` and `$CDN_ROOT/icons/<version>/` — and **stops** if that version already exists with different files (you forgot to bump)
5. checks `https://cdn.parseui.com/…` answers 200 for the new files — and **stops** before npm if not
6. `npm publish` for `@parseui/icons`, then `parseui` — skipping any version that's already on npm

Options: `SKIP_PULL=1` releases the checked-out code as is; `SKIP_NPM=1` stops after the CDN; `CDN_URL=…` checks a different public URL.

### 3. Check

```bash
curl -I https://cdn.parseui.com/1.0.1/parseui.min.js
npm view parseui version
```

## If something goes wrong

- **The script stopped** — nothing after the failing step ran; fix the cause and run it again. Finished steps are skipped (same files already on the CDN, versions already on npm).
- **A bad version is live** — don't overwrite it. Release a new patch version, then `npm deprecate parseui@<bad version> "Use <new version>"`.
