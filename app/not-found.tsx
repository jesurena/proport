'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { AppButton, AppLabel } from '@integrated-computer-system/ui-kit';
import { useLayout } from '@/app/AppLayout';

export default function NotFound() {
    const { setHideSidebar } = useLayout();

    useEffect(() => {
        setHideSidebar(true);
        return () => setHideSidebar(false);
    }, [setHideSidebar]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background select-none">
            <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">

                {/* Aria Mascot 404 illustration */}
                <div className="flex justify-center">
                    <img
                        src="/aria-mascott-404.svg"
                        alt="Aria Mascot 404"
                        className="w-72 h-72 object-contain"
                    />
                </div>

                {/* Text Details */}
                <div className="space-y-2">
                    <AppLabel as="h1" variant="title" className="text-2xl font-extrabold text-foreground">
                        Page Not Found
                    </AppLabel>
                    <AppLabel as="p" variant="description" className="text-sm max-w-sm mx-auto leading-relaxed">
                        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
                    </AppLabel>
                </div>
                <Link href="/">
                    <AppButton variant="neutral" size="lg" leftIcon={<Home size={16} />}>
                        Back to Dashboard
                    </AppButton>
                </Link>
            </div>
        </div>
    );
}       