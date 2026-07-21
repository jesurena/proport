import React from 'react';
import { Settings, Shield, UserCheck } from 'lucide-react';
import { AuthUser } from '@/modules/auth/types/user';
import GeneralTab from '../components/tabs/GeneralTab';
import RolesTab from '../components/tabs/RolesTab';
import AssignmentTab from '../components/tabs/AssignmentTab';

export interface SettingsTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  group: string;
  component: React.ComponentType<any>;
  checkVisibility?: (user: AuthUser | null, role: string) => boolean;
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
    id: 'assignment',
    label: 'Assignment',
    icon: UserCheck,
    group: 'Preferences',
    component: AssignmentTab,
    checkVisibility: (user, role) => role === 'buyer',
  },
  {
    id: 'roles',
    label: 'Roles',
    icon: Shield,
    group: 'Preferences',
    component: RolesTab,
    checkVisibility: (user) => Boolean(user?.is_developer),
  },
];

export function getSettingsTabs(user: AuthUser | null, role: string): SettingsTabItem[] {
  return SETTINGS_TABS_CONFIG.filter(
    (tab) => !tab.checkVisibility || tab.checkVisibility(user, role)
  );
}
