export interface RuntimeConfig {
  marketFetchTimeoutMs: number;
  webhookTimeoutMs: number;
  notificationCooldownMs: number;
  maxAlertsPerHour: number;
}

const toPosInt = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

export const runtimeConfig: RuntimeConfig = {
  marketFetchTimeoutMs: toPosInt(process.env.MARKET_FETCH_TIMEOUT_MS, 5000),
  webhookTimeoutMs: toPosInt(process.env.WEBHOOK_TIMEOUT_MS, 5000),
  notificationCooldownMs: toPosInt(process.env.NOTIFICATION_COOLDOWN_MS, 30 * 60 * 1000),
  maxAlertsPerHour: toPosInt(process.env.MAX_ALERTS_PER_HOUR, 12),
};

export const envValidation = {
  ok: true,
  warnings: [
    !process.env.MARKET_DATA_BASE_URL ? 'MARKET_DATA_BASE_URL not set; default Yahoo endpoint will be used.' : '',
  ].filter(Boolean),
};
