import React from 'react';
import { Settings, Shield } from 'lucide-react';
import { AuthUser } from '@/modules/auth/types/user';
import GeneralTab from '../components/tabs/GeneralTab';
import RolesTab from '../components/tabs/RolesTab';

export interface SettingsTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  group: string;
  component: React.ComponentType<any>;
  checkVisibility?: (user: AuthUser | null) => boolean;
}

export const SETTINGS_TABS_CONFIG: SettingsTabItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: Settings,
    group: 'Preferences',
    component: GeneralTab,
  },
  {
    id: 'roles',
    label: 'Roles',
    icon: Shield,
    group: 'Preferences',
    component: RolesTab,
    checkVisibility: (user) => Boolean(user?.isDeveloper),
  },
];

export function getSettingsTabs(user: AuthUser | null): SettingsTabItem[] {
  return SETTINGS_TABS_CONFIG.filter(
    (tab) => !tab.checkVisibility || tab.checkVisibility(user)
  );
}
