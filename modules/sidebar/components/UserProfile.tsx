'use client';

import React from 'react';
import { AppAvatar, AppDropdown, AppLabel } from '@integrated-computer-system/ui-kit';
import type { MenuProps } from 'antd';
import { Settings, LogOut, MoreVertical } from 'lucide-react';
import { useAuthStore } from '@/modules/auth';
import { useAuth } from '@/hooks/auth/useAuth';

interface UserProfileProps {
    collapsed: boolean;
    setSettingsOpen: (open: boolean) => void;
}

export default function UserProfile({ collapsed, setSettingsOpen }: UserProfileProps) {
    const { user } = useAuthStore();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'settings',
            label: (
                <div className="flex items-center gap-2 py-1">
                    <Settings size={16} />
                    <span>Settings</span>
                </div>
            ),
            onClick: () => setSettingsOpen(true),
        },
        {
            key: 'logout',
            label: (
                <div className="flex items-center gap-2 py-1 text-red-500">
                    <LogOut size={16} />
                    <span>Logout</span>
                </div>
            ),
            onClick: handleLogout,
        },
    ];

    const displayName = user ? `${user.first_name} ${user.last_name}` : 'Guest User';
    const displayEmail = user ? user.email : 'guest@proport.com';
    
    // Generate initials for avatar seed
    const initials = user 
        ? `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase() 
        : 'GU';
    const displayAvatar = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${initials}`;

    if (collapsed) {
        return (
            <AppDropdown items={userMenuItems} placement="topRight" trigger={['click']}>
                <div className="cursor-pointer group flex items-center justify-center p-1 select-none">
                    <AppAvatar
                        src={displayAvatar}
                        name={displayName}
                        size={36}
                        className="bg-accent-1 text-white font-bold shadow-sm group-hover:scale-105 transition-transform"
                    />
                </div>
            </AppDropdown>
        );
    }

    return (
        <AppDropdown items={userMenuItems} placement="topRight" trigger={['click']}>
            <div id="tour-user-profile" className="flex items-center justify-between cursor-pointer group select-none">
                <div className="flex items-center p-2 gap-3 overflow-hidden w-full">
                    <AppAvatar
                        src={displayAvatar}
                        name={displayName}
                        size={36}
                        className="bg-accent-1 text-white font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="flex flex-col text-left overflow-hidden">
                        <AppLabel as="span" className="leading-none truncate text-[13px] font-semibold text-foreground">
                            {displayName}
                        </AppLabel>
                        <AppLabel as="span" variant="description" className="truncate text-[11px]">
                            {displayEmail}
                        </AppLabel>
                    </div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 group-hover:text-accent-1 transition-colors flex-shrink-0" />
            </div>
        </AppDropdown>
    );
}
