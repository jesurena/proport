'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppLabel } from '@integrated-computer-system/ui-kit';
import PrivacyModal from './PrivacyModal';
import { InteractiveCharacters } from './InteractiveCharacters';
import { useAuth } from '@/hooks/auth/useAuth';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function LoginClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorParam = searchParams.get('error');

    const [isClient, setIsClient] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isReacting, setIsReacting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login, isLoginPending } = useAuth();

    const triggerReaction = () => {
        setIsReacting(true);
        setTimeout(() => setIsReacting(false), 2500);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (errorParam === 'insufficient_access') {
            setErrorMessage('Insufficient Access. Please contact the APPSDEV TEAM.');
        }
    }, [errorParam]);

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            triggerReaction();
            const token = credentialResponse.credential;
            if (!token) throw new Error('No credential token received');
            await login(token);
            router.push('/');
        } catch (err: unknown) {
            console.error('Google login failed:', err);
            setErrorMessage('An error occurred during authentication. Please try again.');
        }
    };

    const handleError = () => {
        console.error('Google Sign-In failed');
        setErrorMessage('Google Sign-In failed. Please try again.');
    };

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    if (!isClient || isLoginPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <div className="w-10 h-10 border-4 border-[#1e1b18] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Verifying session...</p>
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
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
                            src="/login.gif"
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

                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium w-full text-center">
                                {errorMessage}
                            </div>
                        )}

                        {/* Google Sign-In Button */}
                        <div className="w-full flex flex-col items-center justify-center gap-4 cursor-pointer" onClickCapture={triggerReaction}>
                            <GoogleLogin
                                onSuccess={(res) => {
                                    triggerReaction();
                                    handleSuccess(res);
                                }}
                                onError={handleError}
                                theme="filled_blue"
                                size="large"
                                shape="rectangular"
                                width="380"
                            />
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
        </GoogleOAuthProvider>
    );
}
