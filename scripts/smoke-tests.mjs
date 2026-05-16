import { spawn } from 'node:child_process';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
};

const dev = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
try {
  await sleep(6000);
  const market = await fetchJson('http://localhost:3000/api/market');
  if (!Array.isArray(market.data) || market.data.length === 0) throw new Error('market data invalid');
  const alerts = await fetchJson('http://localhost:3000/api/market/alerts');
  if (!Array.isArray(alerts.latestAlerts)) throw new Error('alerts invalid');
  const health = await fetchJson('http://localhost:3000/api/health');
  if (!health.status) throw new Error('health invalid');
  console.log('smoke tests passed');
} finally {
  dev.kill('SIGTERM');
}
