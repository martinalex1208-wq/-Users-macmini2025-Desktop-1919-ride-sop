# Vibe Market Radar - Sprint 8 Cloudflare Migration

## Compatibility Check
- App Router: ✅
- API Routes: ✅
- Webhook fetch: ✅ (timeout + bounded retry)
- Env variables: ✅
- Health endpoint: ✅
- Calibration endpoint: ✅
- FS persistence: ⚠️ not suitable for Cloudflare Workers, replaced by storage adapter abstraction.

## Storage Adapter
`lib/market/storage/`
- `localJsonStorage.ts`: local development persistence
- `kvStorage.ts`: Cloudflare KV persistence (`MARKET_HISTORY_KV`, `MARKET_ALERTS_KV`)
- `memoryStorage.ts`: runtime fallback
- `storageAdapter.ts`: auto select by runtime/env

Selection logic:
- local runtime -> `local-json`
- cloudflare + KV enabled -> `kv`
- cloudflare without KV -> `memory` (no crash)

## Cloudflare / OpenNext Setup
> Official recommendation target: OpenNext Cloudflare adapter

Install (when registry access is available):
```bash
npm i -D @opennextjs/cloudflare wrangler
```

Commands:
```bash
npm run cf:build
npm run cf:preview
npm run cf:deploy
```

## Wrangler Config
- `wrangler.toml` included with:
  - `main = ".open-next/worker.js"`
  - KV bindings for history and alerts
  - runtime vars

## Health API
`GET /api/health` now includes:
- `runtime: local | cloudflare`
- `storageMode: local-json | kv | memory`
- `kvAvailable`
- `dataMode`
- notification status fields

## Local vs Production Storage
- Local dev: JSON files under `data/market`
- Cloudflare production: KV storage
- KV missing/misconfigured: memory fallback (degraded but non-crashing)

## Known Limitations
- Package install for `@opennextjs/cloudflare` may fail in restricted registry environments.
- Memory fallback is non-durable across worker isolates/restarts.

## Deployment Guide (Cloudflare)
1. Create KV namespaces:
   - `MARKET_HISTORY_KV`
   - `MARKET_ALERTS_KV`
2. Put namespace IDs into `wrangler.toml`.
3. Set secrets/vars in Cloudflare dashboard:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
   - webhook/env variables
4. Build/deploy:
   - `npm run build`
   - `npm run cf:build`
   - `npm run cf:deploy`
