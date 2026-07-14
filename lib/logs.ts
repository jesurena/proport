import { getItem, setItem } from './storage';

export interface UserLog {
  id: string;
  name: string;
  avatar?: string;
  module: string;
  activity: string;
  dateTime: string; // ISO String
}

const STORAGE_KEY = 'tcd_user_logs';

const DEFAULT_LOGS: UserLog[] = [
  {
    id: 'l1',
    name: 'John Dela Cruz',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JD',
    module: 'Dashboard',
    activity: 'Viewed Main Dashboard and system status charts',
    dateTime: new Date(Date.now() - 5 * 60000).toISOString(), // 5m ago
  },
  {
    id: 'l2',
    name: 'John Dela Cruz',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JD',
    module: 'Tickets',
    activity: 'Opened and inspected ticket details for #0002',
    dateTime: new Date(Date.now() - 22 * 60000).toISOString(), // 22m ago
  },
  {
    id: 'l3',
    name: 'John Dela Cruz',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JD',
    module: 'System Maintenance',
    activity: 'Edited Supplier Settings (updated Ingram Micro configuration)',
    dateTime: new Date(Date.now() - 1.5 * 3600000).toISOString(), // 1.5h ago
  },
  {
    id: 'l4',
    name: 'John Dela Cruz',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JD',
    module: 'Authentication',
    activity: 'Logged in successfully via corporate AD domain',
    dateTime: new Date(Date.now() - 3 * 3600000).toISOString(), // 3h ago
  },
  {
    id: 'l5',
    name: 'System Engine',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SE',
    module: 'Database',
    activity: 'Completed database seed operation for tickets',
    dateTime: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
  },
];

export function ensureLogsSeeded(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    setItem(STORAGE_KEY, DEFAULT_LOGS);
  }
}

export function getUserLogs(): UserLog[] {
  ensureLogsSeeded();
  return getItem<UserLog[]>(STORAGE_KEY, DEFAULT_LOGS);
}

export function addLog(module: string, activity: string): UserLog {
  const logs = getUserLogs();
  const newLog: UserLog = {
    id: String(Date.now() + Math.random()),
    name: 'John Dela Cruz',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JD',
    module,
    activity,
    dateTime: new Date().toISOString(),
  };
  const updated = [newLog, ...logs].slice(0, 150); // limit to 150 items
  setItem(STORAGE_KEY, updated);
  return newLog;
}
