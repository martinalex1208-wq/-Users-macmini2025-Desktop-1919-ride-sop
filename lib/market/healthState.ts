import { NotificationChannel } from './notificationEngine';

let lastDataMode: 'live' | 'partial' | 'mock' = 'mock';
let lastNotification: string | null = null;
let notificationStatus: 'sent' | 'skipped' | 'failed' | 'idle' = 'idle';
let activeChannels: NotificationChannel[] = [];

export const setLastDataMode = (mode: 'live' | 'partial' | 'mock') => { lastDataMode = mode; };
export const setNotificationState = (state: { lastNotification: string | null; notificationStatus: 'sent' | 'skipped' | 'failed'; activeChannels: NotificationChannel[] }) => {
  lastNotification = state.lastNotification;
  notificationStatus = state.notificationStatus;
  activeChannels = state.activeChannels;
};

export const getHealthState = () => ({ lastDataMode, lastNotification, notificationStatus, activeChannels });
