'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppDropdown, AppLabel } from '@integrated-computer-system/ui-kit';
import type { MenuProps } from 'antd';
import { ChevronDown } from 'lucide-react';
import { ICS_APPS } from '@/lib/apps';

export default function SidebarAppDropdown() {
    const router = useRouter();

    const externalApps = ICS_APPS.filter(a => a.inSidebar && !a.internal);
    const internalApps = ICS_APPS.filter(a => a.inSidebar && a.internal);

    const workspaceMenuItems: MenuProps['items'] = [
        ...externalApps.map(app => ({
            key: app.id,
            label: (
                <div className="flex items-center justify-start gap-3 py-1.5">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: app.color }}
                    >
                        {React.cloneElement(app.icon as React.ReactElement<any>, { size: 20 })}
                    </div>
                    <div className="flex flex-col">
                        <AppLabel as="span" variant="label" className="!text-foreground !font-bold leading-tight">
                            {app.label}
                        </AppLabel>
                        <AppLabel as="span" variant="info" className="mt-0.5 max-w-[220px] whitespace-normal break-words">
                            {app.description}
                        </AppLabel>
                    </div>
                </div>
            ),
            onClick: () => window.open(app.url, '_blank'),
        })),
        ...(internalApps.length > 0 ? [{ type: 'divider' as const }] : []),
        ...internalApps.map(app => ({
            key: app.id,
            label: (
                <div className="flex items-center justify-start gap-3 py-1.5">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: app.color }}
                    >
                        {React.cloneElement(app.icon as React.ReactElement<any>, { size: 20 })}
                    </div>
                    <div className="flex flex-col">
                        <AppLabel as="span" variant="label" className="!text-foreground !font-bold leading-tight">
                            {app.label}
                        </AppLabel>
                        <AppLabel as="span" variant="description" className="text-xs mt-0.5 max-w-[220px] whitespace-normal break-words">
                            {app.description}
                        </AppLabel>
                    </div>
                </div>
            ),
            onClick: () => router.push(app.url),
        })),
    ];

    return (
        <AppDropdown
            items={workspaceMenuItems}
            trigger={['click']}
            placement="bottomLeft"
            menuProps={{ className: '!min-w-[300px]' }}
        >
            <div className="flex items-center justify-start gap-3 px-2 py-1.5 hover:bg-hover rounded-lg cursor-pointer transition-colors group select-none">
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <img
                        src="/aria.svg"
                        alt="Aria Logo"
                        className="w-full h-full object-contain hover:scale-105 transition-transform"
                    />
                </div>
                <div className="flex flex-col">
                    <AppLabel as="span" variant="title" className="tracking-tight text-base md:text-lg font-bold leading-none">
                        Proport
                    </AppLabel>
                </div>
                <ChevronDown size={14} className="text-text-info group-hover:text-text transition-colors" />
            </div>
        </AppDropdown>
    );
}
