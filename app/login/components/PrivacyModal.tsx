'use client';

import React from 'react';
import { AppModal, AppLabel, AppButton } from '@integrated-computer-system/ui-kit';

interface PrivacyModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function PrivacyModal({ visible, onClose }: PrivacyModalProps) {
    return (
        <AppModal
            open={visible}
            onClose={onClose}
            centered
            width={600}
        >
            <AppModal.Header className="items-center text-center">
                <AppModal.Title>Privacy Policy</AppModal.Title>
                <AppModal.Description>
                    How we handle and protect your data to ensure a secure AI experience.
                </AppModal.Description>
            </AppModal.Header>

            <AppModal.Body>
                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <section className="animate-in fade-in duration-300">
                        <AppLabel as="h3" variant="title" className="uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground/90 font-bold text-[13px]">
                            1. Information We Collect
                        </AppLabel>
                        <AppLabel as="p" className="text-foreground/70 leading-relaxed pl-3.5 text-[13px]">
                            When you use our services, we may collect information regarding your Google account (such as email, name, and profile picture) through Google OAuth. We also collect usage data to improve our services and understand how users interact with our AI platform.
                        </AppLabel>
                    </section>

                    <section className="animate-in fade-in duration-300 delay-75">
                        <AppLabel as="h3" variant="title" className="uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground/90 font-bold text-[13px]">
                            2. How We Use Information
                        </AppLabel>
                        <AppLabel as="p" className="text-foreground/70 leading-relaxed pl-3.5 text-[13px]">
                            We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users. Your data helps train and improve our AI models to provide more accurate and relevant responses.
                        </AppLabel>
                    </section>

                    <section className="animate-in fade-in duration-300 delay-150">
                        <AppLabel as="h3" variant="title" className="uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground/90 font-bold text-[13px]">
                            3. Data Sharing
                        </AppLabel>
                        <div className="p-4 rounded-xl border border-border bg-neutral/30 mb-3 ml-3.5">
                            <AppLabel as="p" className="text-[13px] font-bold text-text">
                                We do not sell your personal data to third parties.
                            </AppLabel>
                        </div>
                        <AppLabel as="p" className="text-foreground/70 leading-relaxed pl-3.5 text-[13px]">
                            We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                        </AppLabel>
                    </section>

                    <section className="animate-in fade-in duration-300 delay-200">
                        <AppLabel as="h3" variant="title" className="uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground/90 font-bold text-[13px]">
                            4. Data Security
                        </AppLabel>
                        <AppLabel as="p" className="text-foreground/70 leading-relaxed pl-3.5 text-[13px]">
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                        </AppLabel>
                    </section>

                    <section className="animate-in fade-in duration-300 delay-300 pb-4">
                        <AppLabel as="h3" variant="title" className="uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground/90 font-bold text-[13px]">
                            5. Updates
                        </AppLabel>
                        <AppLabel as="p" className="text-foreground/70 leading-relaxed pl-3.5 text-[13px]">
                            We reserve the right to change this policy from time to time by updating this page. Your continued use of the services agrees to the revised policy.
                        </AppLabel>
                    </section>
                </div>
            </AppModal.Body>

            <AppModal.Footer className="justify-center">
                <AppButton
                    onClick={onClose}
                    variant="primary"
                    size="lg"
                    className="rounded-full px-8 py-2 font-semibold h-11 cursor-pointer"
                >
                    I Understand    
                </AppButton>
            </AppModal.Footer>
        </AppModal>
    );
}
