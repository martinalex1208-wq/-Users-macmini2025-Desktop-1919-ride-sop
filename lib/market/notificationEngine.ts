import { runtimeConfig } from './config';
import { MarketAlert } from './types';

export type NotificationChannel = 'discord' | 'telegram' | 'generic';
export type NotificationStatus = 'sent' | 'skipped' | 'failed';

const sentMap = new Map<string, number>();
const sentWindow: number[] = [];
let lastRegimeTransitionAt = 0;

const makeKey = (alert: MarketAlert) => `${alert.triggerSource}:${alert.level}:${alert.title}`;

const shouldNotifyByLevel = (level: MarketAlert['level'], threshold: MarketAlert['level']) => {
  const rank = { info: 0, warning: 1, danger: 2, critical: 3 };
  return rank[level] >= rank[threshold];
};

const withinHourlyCap = () => {
  const now = Date.now();
  while (sentWindow.length && now - sentWindow[0] > 60 * 60 * 1000) sentWindow.shift();
  return sentWindow.length < runtimeConfig.maxAlertsPerHour;
};

export const getNotificationConfig = () => ({
  cooldownMs: runtimeConfig.notificationCooldownMs,
  maxAlertsPerHour: runtimeConfig.maxAlertsPerHour,
  levelThreshold: 'warning' as const,
});

export const shouldSendNotification = (
  alert: MarketAlert,
  threshold: MarketAlert['level'] = 'warning',
): { shouldSend: boolean; reason?: string; key: string } => {
  const key = makeKey(alert);
  if (!shouldNotifyByLevel(alert.level, threshold)) return { shouldSend: false, reason: 'below-threshold', key };
  if (!withinHourlyCap()) return { shouldSend: false, reason: 'hourly-cap', key };

  const now = Date.now();
  const last = sentMap.get(key);
  const highPriority = alert.triggerSource === 'regime' || alert.level === 'critical';

  if (alert.triggerSource === 'regime' && lastRegimeTransitionAt && now - lastRegimeTransitionAt < runtimeConfig.notificationCooldownMs) {
    return { shouldSend: false, reason: 'regime-suppressed', key };
  }

  if (!highPriority && last && now - last < runtimeConfig.notificationCooldownMs) return { shouldSend: false, reason: 'cooldown', key };
  if (last && now - last < 5000) return { shouldSend: false, reason: 'dedup', key };
  return { shouldSend: true, key };
};

const postJsonWithTimeout = async (url: string, payload: unknown) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), runtimeConfig.webhookTimeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return res.ok;
  } finally {
    clearTimeout(timer);
  }
};

const sendDiscord = async (content: string) => {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return false;
  return postJsonWithTimeout(url, { content });
};
const sendTelegram = async (content: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  return postJsonWithTimeout(`https://api.telegram.org/bot${token}/sendMessage`, { chat_id: chatId, text: content });
};
const sendGeneric = async (content: string) => {
  const url = process.env.GENERIC_WEBHOOK_URL;
  if (!url) return false;
  return postJsonWithTimeout(url, { text: content, source: 'vibe-market-radar' });
};

export const deliverAlert = async (alert: MarketAlert): Promise<{ status: NotificationStatus; channels: NotificationChannel[]; key: string }> => {
  const decision = shouldSendNotification(alert);
  if (!decision.shouldSend) return { status: 'skipped', channels: [], key: decision.key };

  const text = `[${alert.level.toUpperCase()}] ${alert.title}\n${alert.description}`;
  const channels: NotificationChannel[] = [];
  let ok = false;

  for (let i = 0; i < 2; i += 1) {
    try {
      const [d, t, g] = await Promise.all([sendDiscord(text), sendTelegram(text), sendGeneric(text)]);
      if (d) channels.push('discord');
      if (t) channels.push('telegram');
      if (g) channels.push('generic');
      ok = d || t || g;
      if (ok) break;
    } catch {
      ok = false;
    }
  }

  if (ok) {
    const now = Date.now();
    sentMap.set(decision.key, now);
    sentWindow.push(now);
    if (alert.triggerSource === 'regime') lastRegimeTransitionAt = now;
    return { status: 'sent', channels: Array.from(new Set(channels)), key: decision.key };
  }

  return { status: 'failed', channels: [], key: decision.key };
};

export const getActiveChannels = (): NotificationChannel[] => {
  const arr: NotificationChannel[] = [];
  if (process.env.DISCORD_WEBHOOK_URL) arr.push('discord');
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) arr.push('telegram');
  if (process.env.GENERIC_WEBHOOK_URL) arr.push('generic');
  return arr;
};
