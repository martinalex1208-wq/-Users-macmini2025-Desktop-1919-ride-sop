# Vibe Market Radar (MVP)

## Tech Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Yahoo Finance Public API (with mock fallback)

## Install & Run
```bash
npm install
npm run dev
```
Open: `http://localhost:3000/vibe-market-radar`

## Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

- `MARKET_DATA_BASE_URL`: API base URL (default Yahoo Finance)
- `MARKET_DATA_API_KEY`: reserved for other providers (never hardcode)

## Pages
- Dashboard: `/vibe-market-radar`
- Settings: `/vibe-market-radar/settings`

## Features Implemented
1. Global risk score 0–100
2. Traffic-light risk levels
3. Indicators: DXY, US10Y, USDJPY, VIX, S&P500, Nasdaq, EEM
4. Each indicator shows latest value, daily change, risk score, weight
5. Adjustable weights on settings page (saved in localStorage)
6. `lib/market/riskEngine.ts` centralized risk scoring
7. Mock data fallback when API fails
8. Basic input validation for user-entered weights
9. API errors are not exposed in frontend

## Risk model v1
- DXY/US10Y rise faster => higher risk
- USDJPY sharp rise => carry trade risk up
- VIX >20 warning; >30 danger
- Equities and EEM falling => higher risk

## Next steps
- Add historical line chart and trend regime (Recharts)
- Add server-side persisted weights (DB)
- Add alert webhooks/Telegram
- Add backtesting and model calibration
