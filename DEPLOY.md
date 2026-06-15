# Gaila — Production Deploy Checklist

## Prerequisites

- Node.js 20+ and npm
- MongoDB reachable from the server
- nginx reverse proxy to `127.0.0.1:3002`
- PM2 installed globally

## Environment (`.env.production.local`)

Create or update `/home/gaila/.env.production.local` (never commit this file):

| Variable | Requirement |
|----------|-------------|
| `APP_URL` | Production URL, e.g. `https://gaila.ae` |
| `MONGODB_URI` | Valid connection string using the `gaila` database |
| `SESSION_SECRET` | **32+ random characters** (generate with `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | **Strong password** (8+ chars; 16+ recommended) |
| `ADMIN_NAME` | Display name for the admin user |

Optional:

- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — distributed lead rate limiting
- `TRUST_PROXY_HEADERS=true` — only if nginx strips untrusted `X-Forwarded-For`

## Deploy steps

```bash
cd /home/gaila

# 1. Install dependencies (after package changes)
npm ci

# 2. Production build
npm run build

# 3. Restart the app
pm2 restart ecosystem.config.cjs --update-env

# 4. Verify
pm2 status gaila
pm2 logs gaila --lines 30
curl -I https://gaila.ae
```

## First-time PM2 setup

```bash
cd /home/gaila
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

## Post-deploy checks

- [ ] Homepage loads over HTTPS
- [ ] `/robots.txt` and `/sitemap.xml` respond
- [ ] `/uploads/...` serves uploaded media
- [ ] Admin login at `/admin/login` works
- [ ] Unauthenticated `/admin` redirects to login
- [ ] Category/content saves succeed in admin

## nginx notes

The live config should:

- Proxy `/` to `127.0.0.1:3002`
- Serve `/uploads/` from `/home/gaila/public/uploads/` (static alias)
- Set `X-Forwarded-Proto $scheme` for secure cookies
- Include security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

Reload after nginx changes: `sudo nginx -t && sudo systemctl reload nginx`

## Rotating secrets

If `SESSION_SECRET` or `ADMIN_PASSWORD` were placeholders:

```bash
# New session secret (invalidates all admin sessions)
openssl rand -base64 32

# Update .env.production.local, then:
pm2 restart ecosystem.config.cjs --update-env
```

To change the admin password, use the admin UI or:

```bash
npm run admin:create   # only if no admin exists yet
```
