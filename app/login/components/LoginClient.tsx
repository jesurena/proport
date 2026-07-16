'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppLabel } from '@integrated-computer-system/ui-kit';
import PrivacyModal from './PrivacyModal';
import { InteractiveCharacters } from './InteractiveCharacters';

export default function LoginClient() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isReacting, setIsReacting] = useState(false);

    const triggerReaction = () => {
        setIsReacting(true);
        setTimeout(() => setIsReacting(false), 2500);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogin = async () => {
        triggerReaction();
        // Simulate minor redirect delay
        await new Promise((r) => setTimeout(r, 600));
        router.push('/');
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#ffffff]">
            {/* Left Panel */}
            <div className="flex w-full md:w-1/2 lg:w-[45%] flex-col justify-between p-8 sm:p-12 relative z-10 bg-white">
                <div>
                    <Link href="/" className="flex items-center gap-2 group w-max">
                        <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Image
                                src="/aria.svg"
                                alt="Proport Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <AppLabel as="span" className="!text-[#1e1b18] tracking-tight text-lg md:text-xl font-bold">
                            Proport
                        </AppLabel>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[420px] mx-auto text-center">
                    <Image
                        src="/aria-mascott-login.svg"
                        alt="Proport Mascot"
                        width={280}
                        height={280}
                        className="mb-6 drop-shadow-xl"
                        priority
                    />
                    <AppLabel as="h1" variant="title" className="!text-[#1e1b18] mb-2.5 tracking-tight font-bold !text-[34px]">
                        Login your account
                    </AppLabel>
                    <AppLabel as="p" className="mb-6 text-sm md:text-base !text-[#1e1b18]/65 font-medium">
                        Welcome back! Please login to continue using Proport.
                    </AppLabel>

                    {/* Styled Mock Google Sign-In Button */}
                    <div className="w-full flex flex-col items-center justify-center" onClickCapture={triggerReaction}>
                        <button
                            onClick={handleLogin}
                            className="flex items-center justify-center gap-3 px-4 py-2 border border-border bg-white text-text hover:bg-neutral-50 rounded-xl transition-all cursor-pointer font-semibold shadow-sm w-full h-12"
                        >
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path
                                    fill="#EA4335"
                                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.354 0 3.373 2.736 1.545 6.727l3.72 3.038Z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.275c0-.825-.073-1.62-.21-2.385H12v4.51h6.46A5.523 5.523 0 0 1 16.08 18l3.705 2.87c2.164-1.996 3.705-4.936 3.705-8.595Z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.955-1.075 7.94-2.915L16.235 18.2c-1.1.737-2.51 1.173-4.235 1.173-3.255 0-6.014-2.19-7-5.136l-3.79 2.927C3.064 21.055 7.155 24 12 24Z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5 14.237a7.126 7.126 0 0 1 0-4.474l-3.79-2.927A11.95 11.95 0 0 0 0 12c0 1.83.41 3.568 1.145 5.127l3.855-2.89Z"
                                />
                            </svg>
                            <span className="text-black text-xs font-bold font-sans tracking-wide">Sign in with Google</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center text-[13px] !text-[#1e1b18]/50 font-medium">
                    <AppLabel as="span" className="text-[13px] !text-[#1e1b18]/50">Copyright © {new Date().getFullYear()} AppDev Central</AppLabel>
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsPrivacyModalOpen(true);
                        }}
                        className="hover:!text-[#1e1b18] transition-colors"
                    >
                        <AppLabel as="span" className="text-[13px] !text-[#1e1b18]/80 hover:!text-[#1e1b18] font-semibold">Privacy Policy</AppLabel>
                    </Link>
                </div>
            </div>

            {/* Right Panel */}
            <div className="hidden md:flex w-1/2 lg:w-[55%] bg-[#efeae6] relative overflow-hidden flex-col justify-between pt-16 pb-0 px-12 lg:px-24">
                <div />

                <div className="relative z-10 w-full max-w-xl select-none">
                    <AppLabel as="h2" variant="title" className="mb-6 leading-[1.2] tracking-tight !text-[#1e1b18] !text-[42px] lg:!text-[48px] font-black">
                        Your sales inquiries, managed seamlessly.
                    </AppLabel>
                    <AppLabel as="p" className="!text-[#1e1b18]/70 leading-relaxed mb-12 !text-[18px] lg:!text-[20px] font-semibold">
                        Log in to track tickets, collaborate with buyers, and secure the best pricing checkups. We&apos;re excited to help you streamline your sales workflow!
                    </AppLabel>
                </div>

                <div className="relative w-full h-[460px] flex items-end justify-center">
                    <InteractiveCharacters isReacting={isReacting} />
                </div>
            </div>

            <PrivacyModal
                visible={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
        </div>
    );
}
