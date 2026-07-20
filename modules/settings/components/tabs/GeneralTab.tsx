'use client';

import React from 'react';
import { Slider } from 'antd';
import { ShoppingBag } from 'lucide-react';
import { AppLabel, cn } from '@integrated-computer-system/ui-kit';
import { ThemeCard } from '../ThemeCard';
import { COLOR_THEMES } from '../../constants/themes';
import { useTheme } from '@/components/Providers/theme-provider';
import type { Theme } from '@/components/Providers/theme-provider';

export default function GeneralTab() {
    const { theme, setTheme, fontSizeOffset, setFontSizeOffset } = useTheme();

    const handleMarketplaceOpen = () => {
        window.dispatchEvent(new CustomEvent('tcd-open-marketplace'));
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div>
                <AppLabel as="h3" variant="title">Appearance</AppLabel>
                <AppLabel as="p" variant="description" className="mt-1">
                    Choose a theme for the portal interface.
                </AppLabel>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COLOR_THEMES.map((themeItem) => (
                    <ThemeCard
                        key={themeItem.id}
                        themeItem={themeItem}
                        isSelected={themeItem.id === theme}
                        onSelect={(themeId) => setTheme(themeId as Theme)}
                    />
                ))}

                <div
                    onClick={handleMarketplaceOpen}
                    className={cn(
                        'flex flex-col rounded-2xl border-2 transition-all cursor-pointer relative select-none overflow-hidden',
                        'border-transparent hover:border-border'
                    )}
                >
                    <div className="w-full h-24 flex items-center justify-center bg-[#1f1f23] dark:bg-[#1f1f23]">
                        <div className="w-11 h-11 rounded-2xl bg-white/8 flex items-center justify-center">
                            <ShoppingBag size={20} className="text-zinc-300" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 w-full justify-between bg-neutral/10 border-t border-border/40 mt-auto">
                        <AppLabel as="span" className="text-xs font-bold leading-none truncate text-foreground/80">
                            Browse Marketplace
                        </AppLabel>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <AppLabel as="label" variant="label" className="mb-3 block font-semibold text-foreground/90">
                        Text Size
                    </AppLabel>
                    <AppLabel as="p" variant="description" className="mt-1">
                        Adjust the size of the text in the app to make it easier to read.
                    </AppLabel>
                </div>

                <div className="w-full sm:w-105 px-2 select-none mb-3">
                    <Slider
                        min={-2}
                        max={4}
                        value={fontSizeOffset}
                        onChange={(value) => setFontSizeOffset(Array.isArray(value) ? value[0] : value)}
                        tooltip={{
                            formatter: (value) => {
                                switch (value) {
                                    case -2:
                                        return 'XS';
                                    case -1:
                                        return 'Small';
                                    case 0:
                                        return 'Default';
                                    case 1:
                                        return 'Medium';
                                    case 2:
                                        return 'Large';
                                    case 3:
                                        return 'XL';
                                    case 4:
                                        return 'XXL';
                                    default:
                                        return 'Default';
                                }
                            },
                        }}
                        marks={{
                            '-2': 'XS',
                            '0': 'Default',
                            '2': 'Large',
                            '4': 'XXL',
                        }}
                    />
                </div>

                <AppLabel as="p" variant="description" className="mt-4 text-xs text-foreground/50">
                    Adjust the size of the text in the app to make it easier to read.
                </AppLabel>
            </div>
        </div>
    );
}
