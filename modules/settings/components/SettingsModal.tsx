'use client';

import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { AppButton, AppModal, AppTabs } from '@/components/ui';
import { useAuthStore } from '@/modules/auth';
import { getSettingsTabs } from '../config/settings-tabs.config';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState('general');
    const { user } = useAuthStore();
    const [mockRole, setMockRole] = useState<string | null>(null);

    React.useEffect(() => {
        const storedRole = typeof window !== 'undefined' ? localStorage.getItem('proport_my_role') : null;
        if (user?.isDeveloper && storedRole) {
            setMockRole(storedRole);
        } else {
            setMockRole(user?.role_name || 'requestor');
        }
    }, [user]);

    const activeRole = mockRole || user?.role_name || 'requestor';

    const visibleTabs = useMemo(() => getSettingsTabs(user, activeRole), [user, activeRole]);

    const activeTabConfig = visibleTabs.find(tab => tab.id === activeTab) || visibleTabs[0];
    const ActiveComponent = activeTabConfig?.component;

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
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </AppModal.Body>
        </AppModal>
    );
}
