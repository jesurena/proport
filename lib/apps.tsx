'use client';

import React from 'react';

interface AppIconProps {
    src: string;
    alt: string;
    size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ src, alt, size = 16 }) => {
    return (
        <img
            src={src}
            alt={alt}
            width={size}
            height={size}
            style={{ width: size, height: size, objectFit: 'contain' }}
        />
    );
};

export interface ICSApp {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    url: string;
    inChat: boolean;
    inSidebar: boolean;
    internal?: boolean;
}

export const ICS_APPS: ICSApp[] = [
    {
        id: 'ice-cream',
        label: 'Ice Cream',
        description: 'Manage ice cream inventory, orders, and reports.',
        icon: <AppIcon src="/ice-cream.svg" alt="Ice Cream" />,
        color: 'linear-gradient(135deg,#f97316,#ec4899)',
        url: 'https://ice-cream.ics.com.ph/',
        inChat: true,
        inSidebar: true,
    },
    {
        id: 'tcd-portal',
        label: 'TCD Portal',
        description: 'Access the TCD client and pricing portal.',
        icon: <AppIcon src="/tcd-portal.svg" alt="TCD Portal" />,
        color: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
        url: 'https://tcd-portal.ics.com.ph/',
        inChat: true,
        inSidebar: true,
    },
];
