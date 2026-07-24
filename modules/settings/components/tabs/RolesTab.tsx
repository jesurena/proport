'use client';

import React, { useState, useEffect } from 'react';
import { AppButton } from '@integrated-computer-system/ui-kit';
import { Shield, ShieldCheck, Wrench, User, Crown, Check, UserCheck } from 'lucide-react';

type Role = 'super_user' | 'admin' | 'buyer' | 'requestor' | 'bu_head' | 'adel' | 'user';

const ROLES: { value: Role; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'super_user', label: 'Super User', icon: <Crown size={11} />, color: 'bg-amber-500/10 text-amber-600 border-amber-400/30' },
    { value: 'admin', label: 'Admin', icon: <ShieldCheck size={11} />, color: 'bg-red-500/10 text-red-600 border-red-400/30' },
    { value: 'buyer', label: 'Buyer', icon: <Wrench size={11} />, color: 'bg-blue-500/10 text-blue-600 border-blue-400/30' },
    { value: 'requestor', label: 'Requestor', icon: <Shield size={11} />, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-400/30' },
    { value: 'bu_head', label: 'BU Head', icon: <UserCheck size={11} />, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-400/30' },
    { value: 'adel', label: 'Ms. Adel (Executive)', icon: <Crown size={11} />, color: 'bg-purple-500/10 text-purple-600 border-purple-400/30' },
];

const STORAGE_KEY = 'proport_my_role';

export default function RolesTab() {
    const [myRole, setMyRole] = useState<Role>('super_user');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Role | null;
        if (stored) setMyRole(stored);
    }, []);

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, myRole);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const currentRoleMeta = ROLES.find((r) => r.value === myRole);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div>
                <h3 className="text-base font-bold text-text">My Role (Preview)</h3>
                <p className="text-sm text-text-info mt-1">
                    Change your role to preview the portal from a different perspective. This only affects your local session.
                </p>
            </div>

            {/* Current role badge */}
            {currentRoleMeta && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold w-fit ${currentRoleMeta.color}`}>
                    {currentRoleMeta.icon}
                    {currentRoleMeta.label}
                </div>
            )}

            {/* Role selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLES.map((role) => {
                    const isActive = myRole === role.value;
                    return (
                        <button
                            key={role.value}
                            onClick={() => setMyRole(role.value)}
                            className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left
                                ${isActive
                                    ? 'bg-accent-1/10 border-accent-1/40 text-accent-1'
                                    : 'border-border/50 text-text-info hover:border-border hover:bg-hover/40 hover:text-text'
                                }`}
                        >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-accent-1/15 text-accent-1' : 'bg-neutral/60 text-text-info'}`}>
                                {role.icon}
                            </div>
                            <span className="leading-none">{role.label}</span>
                            {isActive && <Check size={12} className="ml-auto shrink-0" />}
                        </button>
                    );
                })}
            </div>

            {/* Save */}
            <div className="flex items-center gap-3">
                <AppButton
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    className="text-xs"
                >
                    {saved ? '✓ Saved' : 'Apply Role'}
                </AppButton>
                <span className="text-[11px] text-text-info">
                    Reload the page after saving to see changes.
                </span>
            </div>
        </div>
    );
}
