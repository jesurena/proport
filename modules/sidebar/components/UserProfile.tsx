'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppAvatar, AppDropdown, AppLabel } from '@integrated-computer-system/ui-kit';
import type { MenuProps } from 'antd';
import { Settings, LogOut, MoreVertical } from 'lucide-react';

interface UserProfileProps {
    collapsed: boolean;
    setSettingsOpen: (open: boolean) => void;
}

export default function UserProfile({ collapsed, setSettingsOpen }: UserProfileProps) {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
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

    if (collapsed) {
        return (
            <AppDropdown items={userMenuItems} placement="topRight" trigger={['click']}>
                <div className="cursor-pointer group flex items-center justify-center p-1 select-none">
                    <AppAvatar
                        src="https://api.dicebear.com/7.x/initials/svg?seed=JD"
                        name="John Dela Cruz"
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
                <div className="flex items-center gap-3 overflow-hidden w-full">
                    <AppAvatar
                        src="https://api.dicebear.com/7.x/initials/svg?seed=JD"
                        name="John Dela Cruz"
                        size={36}
                        className="bg-accent-1 text-white font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="flex flex-col text-left overflow-hidden">
                        <AppLabel as="span" className="leading-none mb-1 truncate text-[13px] font-semibold text-foreground">
                            John Dela Cruz
                        </AppLabel>
                        <AppLabel as="span" variant="description" className="truncate text-[11px]">
                            admin@proport.com
                        </AppLabel>
                    </div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 group-hover:text-accent-1 transition-colors flex-shrink-0" />
            </div>
        </AppDropdown>
    );
}
