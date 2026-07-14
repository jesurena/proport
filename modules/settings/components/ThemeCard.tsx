'use client';

import React from 'react';
import { cn, AppLabel } from '@integrated-computer-system/ui-kit';
import { ColorThemeItem, getPreviewColors } from '../constants/themes';

interface ThemeCardProps {
    themeItem: ColorThemeItem;
    isSelected: boolean;
    onSelect: (themeId: string) => void;
}

export function ThemeCard({ themeItem, isSelected, onSelect }: ThemeCardProps) {
    const colors = getPreviewColors(themeItem.id);
    const isSystemTheme = themeItem.id === 'system';

    return (
        <div
            onClick={() => onSelect(themeItem.id)}
            className={cn(
                "flex flex-col rounded-2xl border-2 transition-all cursor-pointer relative select-none overflow-hidden",
                isSelected
                    ? "border-accent-1 bg-accent-1/3 shadow-sm"
                    : "border-transparent hover:border-border"
            )}
        >
            {/* Theme Preview */}
            <div className="w-full h-24 relative overflow-hidden flex">
                {isSystemTheme ? (
                    <>
                        <div className="w-1/2 h-full bg-white border-r border-black/10">
                            <div className="p-2 space-y-1.5 mt-3">
                                <div className="w-full h-1.5 rounded-full bg-slate-200/80" />
                                <div className="w-3/4 h-1.5 rounded-full bg-slate-200/80" />
                                <div className="w-2/3 h-1.5 rounded-full bg-slate-200/80" />
                            </div>
                        </div>
                        <div className="w-1/2 h-full text-white" style={{ backgroundColor: '#141414' }}>
                            <div className="p-2 space-y-1.5 mt-3">
                                <div className="w-full h-1.5 rounded-full bg-white/20" />
                                <div className="w-3/4 h-1.5 rounded-full bg-white/20" />
                                <div className="w-2/3 h-1.5 rounded-full bg-white/20" />
                                <div className="flex gap-2 mt-3">
                                    <div className="w-8 h-5 rounded" style={{ backgroundColor: colors.accentBg, opacity: 0.85 }} />
                                    <div className="w-8 h-5 rounded bg-white/20" />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Sidebar preview */}
                        <div
                            className="w-[30%] h-full border-r"
                            style={{ backgroundColor: colors.sidebarBg, borderColor: 'rgba(0,0,0,0.08)' }}
                        >
                            <div className="p-2 space-y-1.5 mt-3">
                                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: colors.accentBg, opacity: 0.8 }} />
                                <div className="w-3/4 h-1.5 rounded-full bg-gray-300/40" />
                                <div className="w-2/3 h-1.5 rounded-full bg-gray-300/40" />
                            </div>
                        </div>
                        {/* Content preview */}
                        <div className="flex-1 h-full p-3" style={{ backgroundColor: colors.chatBg }}>
                            <div className="space-y-2 mt-2">
                                <div className="w-3/4 h-2 rounded-full bg-gray-300/30" />
                                <div className="w-1/2 h-2 rounded-full bg-gray-300/30" />
                                <div className="flex gap-2 mt-3">
                                    <div className="w-8 h-5 rounded" style={{ backgroundColor: colors.accentBg, opacity: 0.7 }} />
                                    <div className="w-8 h-5 rounded bg-gray-300/30" />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* Label */}
            <div className="flex items-center gap-2 px-3 py-2.5 w-full justify-between bg-neutral/10 border-t border-border/40 mt-auto">
                <AppLabel as="span" className={cn(
                    "text-xs font-bold leading-none truncate",
                    isSelected ? "text-accent-1" : "text-foreground/80"
                )}>
                    {themeItem.name}
                </AppLabel>
            </div>
        </div>
    );
}
