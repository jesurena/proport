'use client';

import React, { useState } from 'react';
import { Settings, Shield, X } from 'lucide-react';
import { AppButton, AppModal, AppTabs } from '@/components/ui';
import type { TabItem } from '@/components/ui/tabs';
import GeneralTab from './tabs/GeneralTab';
import RolesTab from './tabs/RolesTab';
import { useAuthStore } from '@/modules/auth';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const settingsTabs: TabItem[] = [
    {
        id: 'general',
        label: 'General',
        icon: Settings,
        group: 'Preferences',
    },
    {
        id: 'roles',
        label: 'Roles',
        icon: Shield,
        group: 'Preferences',
    },
];

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState('general');
    const { user } = useAuthStore();
    const isDeveloper = user?.isDeveloper ?? false;

    const visibleTabs = settingsTabs.filter(tab => {
        if (tab.id === 'roles' && !isDeveloper) {
            return false;
        }
        return true;
    });

    return (
        <AppModal
            open={visible}
            onClose={onClose}
            width={960}
            padding="none"
            mask={false}
            centered
            closeIcon={null}
        >
            <AppModal.Body className="flex flex-col md:flex-row h-[75vh] md:h-130 relative">
                <AppButton
                    variant="ghost"
                    size="icon"
                    shape="pill"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-foreground/50 hover:text-foreground hover:bg-foreground/5 z-10"
                >
                    <X size={20} />
                </AppButton>
 
                <AppTabs
                    tabs={visibleTabs}
                    activeTab={activeTab}
                    onChange={(tab) => setActiveTab(tab as string)}
                    orientation="vertical"
                    title="Settings"
                />

                <div className="flex-1 overflow-y-auto p-5 md:p-8">
                    {activeTab === 'general' && <GeneralTab />}
                    {activeTab === 'roles' && <RolesTab />}
                </div>
            </AppModal.Body>
        </AppModal>
    );
}
