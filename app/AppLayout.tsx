'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProportSidebar } from '@/modules/sidebar';
import { useAuthStore } from '@/modules/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoginPage && !token) {
      router.replace('/login');
    }
  }, [mounted, isLoginPage, token, router]);

  // Show loading screen during rehydration or redirect check
  if (!isLoginPage && (!mounted || !token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="w-10 h-10 border-4 border-[#1e1b18] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Verifying session...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background transition-colors duration-300">
      <ProportSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
