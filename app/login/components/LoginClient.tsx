'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLabel, AppInput, AppButton } from '@integrated-computer-system/ui-kit';
import { Ticket, LogIn } from 'lucide-react';
import { InteractiveCharacters } from './InteractiveCharacters';

export default function LoginClient() {
    const router = useRouter();
    const [isReacting, setIsReacting] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const triggerReaction = () => {
        setIsReacting(true);
        setTimeout(() => setIsReacting(false), 2500);
    };

    const handleLogin = async () => {
        triggerReaction();
        setLoading(true);
        // Simulate login delay — localStorage only, no real auth
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        router.push('/');
    };

    return (
        <div className="flex min-h-screen bg-[#ffffff]">
            {/* Left Panel */}
            <div className="flex w-full md:w-1/2 lg:w-[45%] flex-col justify-between p-8 sm:p-12 relative z-10 bg-white">
                <div>
                    <div className="flex items-center gap-2 group w-max">
                        <div className="w-9 h-9 rounded-xl bg-[#3b82f6] flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Ticket size={20} className="text-white" />
                        </div>
                        <AppLabel as="span" className="!text-[#1e1b18] tracking-tight text-lg md:text-xl font-bold">
                            Proport
                        </AppLabel>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[420px] mx-auto text-center">
                    {/* TCD Logo/Icon */}
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#3b82f6] to-[#6366f1] flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                        <Ticket size={48} className="text-white" />
                    </div>

                    <AppLabel as="h1" variant="title" className="!text-[#1e1b18] mb-2.5 tracking-tight font-bold !text-[34px]">
                        Login your account
                    </AppLabel>
                    <AppLabel as="p" className="mb-8 !text-[15px] !text-[#1e1b18]/65 font-medium">
                        Welcome back! Sign in to manage your price inquiries.
                    </AppLabel>

                    <div className="w-full space-y-4">
                        <AppInput
                            placeholder="Enter your email"
                            preset="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="lg"
                            onPressEnter={handleLogin}
                        />

                        <AppButton
                            variant="primary"
                            fullWidth
                            size="lg"
                            leftIcon={<LogIn size={18} />}
                            onClick={handleLogin}
                            loading={loading}
                            className="!h-12 !rounded-xl !text-[15px] !font-semibold"
                        >
                            Sign In
                        </AppButton>
                    </div>

                    <p className="text-[13px] text-[#1e1b18]/40 mt-6">
                        Data is stored locally in your browser. No account needed.
                    </p>
                </div>

                <div className="flex justify-between items-center text-[13px] !text-[#1e1b18]/50 font-medium">
                    <AppLabel as="span" className="text-[13px] !text-[#1e1b18]/50">
                        Copyright © {new Date().getFullYear()} Integrated Computer Systems
                    </AppLabel>
                    <AppLabel as="span" className="text-[13px] !text-[#1e1b18]/80 font-semibold">
                        Proport Portal v2.0
                    </AppLabel>
                </div>
            </div>

            {/* Right Panel — Interactive Characters */}
            <div className="hidden md:flex w-1/2 lg:w-[55%] bg-[#efeae6] relative overflow-hidden flex-col justify-between pt-16 pb-0 px-12 lg:px-24">
                <div />

                <div className="relative z-10 w-full max-w-xl select-none">
                    <AppLabel as="h2" variant="title" className="mb-6 leading-[1.2] tracking-tight !text-[#1e1b18] !text-[42px] lg:!text-[48px] font-black">
                        Your price inquiry system, reimagined.
                    </AppLabel>
                    <AppLabel as="p" className="!text-[#1e1b18]/70 leading-relaxed mb-12 !text-[18px] lg:!text-[20px] font-semibold">
                        Track, manage, and resolve supplier price inquiries with a modern, streamlined experience.
                    </AppLabel>
                </div>

                <div className="relative w-full h-[460px] flex items-end justify-center">
                    <InteractiveCharacters isReacting={isReacting} />
                </div>
            </div>
        </div>
    );
}
