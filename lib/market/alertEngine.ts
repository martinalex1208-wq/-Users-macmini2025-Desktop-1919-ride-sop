import { toRiskRegime } from './regime';
import { HistorySnapshot } from './historyStore';
import { IndicatorKey, IndicatorRisk, MarketAlert, AlertLevel } from './types';

const makeAlert = (
  level: AlertLevel,
  title: string,
  description: string,
  triggerSource: 'global' | IndicatorKey | 'regime',
  timestamp: string,
): MarketAlert => ({
  id: `${triggerSource}-${title}-${timestamp}`.replace(/\s+/g, '-').toLowerCase(),
  level,
  title,
  description,
  timestamp,
  triggerSource,
  active: level === 'danger' || level === 'critical',
});

export const evaluateAlerts = (
  totalScore: number,
  indicators: IndicatorRisk[],
  currentTimestamp: string,
  prevSnapshot: HistorySnapshot | null,
): MarketAlert[] => {
  const alerts: MarketAlert[] = [];
  const get = (key: IndicatorKey) => indicators.find((i) => i.key === key);

  if (totalScore >= 80) alerts.push(makeAlert('critical', 'Global risk at crisis level', `Global risk score is ${totalScore}.`, 'global', currentTimestamp));
  else if (totalScore >= 70) alerts.push(makeAlert('danger', 'Global risk elevated', `Global risk score is ${totalScore}.`, 'global', currentTimestamp));
  else if (totalScore >= 50) alerts.push(makeAlert('warning', 'Global risk rising', `Global risk score is ${totalScore}.`, 'global', currentTimestamp));

  if (prevSnapshot) {
    const jump = totalScore - prevSnapshot.totalScore;
    if (jump >= 12) alerts.push(makeAlert('critical', 'Single-day risk jump', `Risk jumped by ${jump.toFixed(1)} points in one snapshot.`, 'global', currentTimestamp));
    else if (jump >= 7) alerts.push(makeAlert('danger', 'Risk jump detected', `Risk rose by ${jump.toFixed(1)} points.`, 'global', currentTimestamp));

    const prevRegime = toRiskRegime(prevSnapshot.totalScore);
    const currRegime = toRiskRegime(totalScore);
    if (prevRegime !== currRegime) alerts.push(makeAlert('critical', 'Risk regime transition', `Market regime changed from ${prevRegime} to ${currRegime}.`, 'regime', currentTimestamp));
  }

  const vix = get('VIX');
  if (vix && (vix.value >= 30 || vix.changePct >= 10)) alerts.push(makeAlert('critical', 'VIX spike', `VIX at ${vix.value} with ${vix.changePct}% daily move.`, 'VIX', currentTimestamp));
  else if (vix && (vix.value >= 20 || vix.changePct >= 5)) alerts.push(makeAlert('warning', 'VIX warning zone', `VIX at ${vix.value} with ${vix.changePct}% move.`, 'VIX', currentTimestamp));

  const dxy = get('DXY');
  if (dxy && dxy.changePct >= 1) alerts.push(makeAlert('danger', 'DXY acceleration', `DXY daily change is ${dxy.changePct}%.`, 'DXY', currentTimestamp));

  const eem = get('EEM');
  if (eem && eem.changePct <= -2.5) alerts.push(makeAlert('critical', 'EEM collapse signal', `EEM fell ${eem.changePct}% today.`, 'EEM', currentTimestamp));
  else if (eem && eem.changePct <= -1.5) alerts.push(makeAlert('warning', 'EEM pressure', `EEM fell ${eem.changePct}% today.`, 'EEM', currentTimestamp));

  return alerts;
};
