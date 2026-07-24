import { AuthUser } from '@/modules/auth/types/user';
import { UserProfile } from '../types';

export interface ProfileTabsVisibilityOptions {
  currentUser: AuthUser | null;
  profileUser?: UserProfile | null;
  targetUserId: string | number;
  isHead?: boolean;
  isAdel?: boolean;
  onlyBrands?: boolean;
  isMe?: boolean;
}

export interface ProfileTabItem {
  id: 'activity' | 'tickets' | 'brands';
  label: string;
  checkVisibility?: (role: string, isMe: boolean, isElevated: boolean) => boolean;
}

// Role permission lists declared at top level for readability
const ACTIVITY_FEED_ROLES = ['bu_head', 'adel', 'buyer', 'admin', 'super_user'];
const TICKETS_ROLES = ['bu_head', 'adel', 'buyer', 'admin', 'super_user'];
const BRANDS_ROLES = ['buyer', 'admin', 'super_user'];

export const PROFILE_TABS_CONFIG: ProfileTabItem[] = [
  {
    id: 'activity',
    label: 'Activity Feed',
    checkVisibility: (role, isMe, isElevated) => isMe || isElevated || ACTIVITY_FEED_ROLES.includes(role),
  },
  {
    id: 'tickets',
    label: 'Tickets',
    checkVisibility: (role, isMe, isElevated) => isMe || isElevated || TICKETS_ROLES.includes(role),
  },
  {
    id: 'brands',
    label: 'Assigned Brands',
    checkVisibility: (role) => BRANDS_ROLES.includes(role),
  },
];

export function getProfileModalTabs(options: ProfileTabsVisibilityOptions): ProfileTabItem[] {
  const { currentUser, profileUser, targetUserId, isHead, isAdel, onlyBrands } = options;

  const currentId = currentUser?.account_id ?? currentUser?.id;
  const isMe = options.isMe !== undefined
    ? options.isMe
    : !!(currentId && targetUserId && String(currentId) === String(targetUserId));

  // 1. Viewing own profile: all tabs EXCEPT brands if not a buyer role
  if (isMe) {
    const myRole = (currentUser?.role_name || profileUser?.role || '').toLowerCase();
    const isMyRoleBuyer = BRANDS_ROLES.includes(myRole);

    if (isMyRoleBuyer) {
      return PROFILE_TABS_CONFIG;
    }

    return PROFILE_TABS_CONFIG.filter((tab) => tab.id !== 'brands');
  }

  const targetRole = (profileUser?.role || '').toLowerCase();
  const viewerRole = (currentUser?.role_name || '').toLowerCase();

  const isViewerSales = viewerRole === 'requestor' || viewerRole === 'sales';
  const isTargetBuyer = BRANDS_ROLES.includes(targetRole);

  // 2. If onlyBrands flag is set OR if a Sales user views a Buyer profile (clicked "View Tagged Brands")
  if (onlyBrands || (isViewerSales && isTargetBuyer)) {
    return PROFILE_TABS_CONFIG.filter((tab) => tab.id === 'brands');
  }

  const isElevated = !!(isHead || isAdel || currentUser?.is_head || currentUser?.is_adel);

  // 3. General role visibility check
  return PROFILE_TABS_CONFIG.filter(
    (tab) => !tab.checkVisibility || tab.checkVisibility(targetRole, isMe, isElevated)
  );
}
