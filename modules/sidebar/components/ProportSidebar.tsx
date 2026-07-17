'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  AppSidebar,
  cn,
} from '@integrated-computer-system/ui-kit';
import {
  PenSquare,
  ChevronDown,
} from 'lucide-react';
import { SettingsModal } from '@/modules/settings';
import SearchModal from '@/components/SearchModal';
import { ComposeModal, useComposeStore } from '@/modules/compose';
import SidebarAppDropdown from './SidebarAppDropdown';
import UserProfile from './UserProfile';
import { getSidebarGroups } from './SidebarGroups';
import { useAuthStore } from '@/modules/auth';

export default function ProportSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams ? searchParams.toString() : '';
  const fullCurrentPath = pathname + (currentQuery ? `?${currentQuery}` : '');

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openCompose = useComposeStore((s) => s.openCompose);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Focus']);
  const [role, setRole] = useState<string>('super_user');

  const { user } = useAuthStore();
  const isDeveloper = user?.isDeveloper ?? false;
  const actualRole = user?.role_name ?? 'buyer';

  const toggleSubMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const stored = localStorage.getItem('proport_my_role');
    if (isDeveloper && stored) {
      setRole(stored);
    } else {
      setRole(actualRole);
    }
  }, [pathname, isDeveloper, actualRole]);

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleCompose = () => {
      openCompose('Focus');
    };
    const handleSearch = () => setSearchOpen(true);
    window.addEventListener('tcd-toggle-sidebar', handleToggle);
    window.addEventListener('tcd-open-compose', handleCompose);
    window.addEventListener('tcd-open-search', handleSearch);
    return () => {
      window.removeEventListener('tcd-toggle-sidebar', handleToggle);
      window.removeEventListener('tcd-open-compose', handleCompose);
      window.removeEventListener('tcd-open-search', handleSearch);
    };
  }, [openCompose]);

  const effectiveUser = React.useMemo(() => {
    if (!user) return null;
    return {
      ...user,
      role_name: role,
    };
  }, [user, role]);

  const menuGroups = getSidebarGroups(effectiveUser);

  const navigate = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <>
      <AppSidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      >
        {/* Header */}
        <AppSidebar.Header className={cn(collapsed ? "!px-2 !py-3" : "!px-3 !py-4")}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <AppSidebar.Toggle />
              {(role === 'sales' || role === 'super_user') && (
                <button
                  onClick={() => openCompose('Focus')}
                  title="Compose Ticket"
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer group">
                  <PenSquare size={15} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between w-full">
                <SidebarAppDropdown />
                <AppSidebar.Toggle className="hidden lg:inline-flex h-8 w-8 shrink-0" />
                <AppSidebar.Toggle
                  isMobile
                  onCloseMobile={() => setMobileOpen(false)}
                  className="lg:hidden h-8 w-8 shrink-0"
                />
              </div>
              {(role === 'sales' || role === 'super_user') && (
                <div className="px-1">
                  {/* Compose button */}
                  <button
                    onClick={() => openCompose('Focus')}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-all text-sm text-left cursor-pointer group border border-border hover:text-text hover:bg-hover/60 font-medium"
                  >
                    <PenSquare size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{role === 'sales' ? 'Compose Ticket' : 'Compose'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </AppSidebar.Header>

        {/* Content Navigation */}
        <AppSidebar.Content>
          {menuGroups.map((group) => (
            <AppSidebar.Group key={group.title} title={collapsed ? '' : group.title}>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isExpanded = expandedMenus.includes(item.name);
                  const tabParam = searchParams ? searchParams.get('tab') : null;
                  const isTabFocus = tabParam === 'focus';
                  const isTabNonFocus = ['non-focus', 'bu-approval', 'bu-declined', 'final-approval', 'adel-declined'].includes(tabParam || '');

                  let isSubActive = hasSubItems && (item.subItems?.some(sub => fullCurrentPath === sub.href) || false);
                  if (item.name === 'Focus' && isTabFocus) {
                    isSubActive = true;
                  }
                  if (item.name === 'Non Focus' && isTabNonFocus) {
                    isSubActive = true;
                  }
                  const isActiveLink = !hasSubItems && fullCurrentPath === item.href;
                  const isParentActive = isSubActive || isActiveLink;
                  const Icon = item.icon;

                  if (hasSubItems) {
                    if (collapsed) {
                      return (
                        <AppSidebar.Item
                          key={item.name}
                          icon={<Icon size={20} />}
                          active={isParentActive}
                          onClick={() => setCollapsed(false)}
                          className="self-center"
                        >
                          <span>{item.name}</span>
                        </AppSidebar.Item>
                      );
                    }

                    return (
                      <div key={item.name} className="flex flex-col gap-1 w-full">
                        <AppSidebar.Item
                          icon={<Icon size={20} />}
                          active={isSubActive}
                          onClick={() => toggleSubMenu(item.name)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{item.name}</span>
                            <ChevronDown size={14} className={cn("transition-transform duration-200", isSubActive ? "text-white" : "text-text-info", isExpanded && "rotate-180")} />
                          </div>
                        </AppSidebar.Item>
                        {isExpanded && (
                          <div className="flex flex-col gap-1 ml-6 pl-4 border-l-2 border-border overflow-hidden animate-in slide-in-from-top-1 duration-200 my-1">
                            {item.subItems?.map((sub) => {
                              const isChildActive = fullCurrentPath === sub.href;
                              return (
                                <button
                                  key={sub.name + '-' + sub.href}
                                  onClick={() => navigate(sub.href)}
                                  className={cn(
                                    "flex items-center px-3 py-1.5 rounded-lg text-[13px] transition-all text-left cursor-pointer",
                                    isChildActive
                                      ? "text-accent-1 bg-accent-1/10 font-bold"
                                      : "text-text/75 hover:text-text hover:bg-hover/40 font-semibold"
                                  )}
                                >
                                  <span className="truncate">{sub.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  let isActive = false;
                  if (item.href === '/tickets') {
                    isActive = pathname === '/tickets' && !tabParam;
                  } else {
                    isActive = fullCurrentPath === item.href;
                  }

                  return (
                    <AppSidebar.Item
                      key={item.href}
                      icon={<Icon size={20} />}
                      active={isActive}
                      onClick={() => navigate(item.href || '#')}
                      className={cn(collapsed && "self-center")}
                      aria-wip={item.isWip ? "true" : undefined}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{item.name}</span>
                        {item.badge !== undefined && item.badge > 0 && !collapsed && (
                          <span className="text-[11px] font-semibold bg-accent-1/15 text-accent-1 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </AppSidebar.Item>
                  );
                })}
              </div>
            </AppSidebar.Group>
          ))}
        </AppSidebar.Content>

        {/* Footer */}
        <AppSidebar.Footer className="!p-3">
          <UserProfile collapsed={collapsed} setSettingsOpen={setSettingsOpen} />
        </AppSidebar.Footer>
      </AppSidebar>

      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ComposeModal />
    </>
  );
}
