'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProportSidebar } from '@/modules/sidebar';
import { useAuthStore } from '@/modules/auth';

interface LayoutContextType {
  hideSidebar: boolean;
  setHideSidebar: (hide: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  hideSidebar: false,
  setHideSidebar: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);
  const [hideSidebar, setHideSidebar] = useState(false);

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset hideSidebar on pathname change
  useEffect(() => {
    setHideSidebar(false);
  }, [pathname]);

  useEffect(() => {
    if (mounted && !isLoginPage && !hideSidebar && !token) {
      router.replace('/login');
    }
  }, [mounted, isLoginPage, hideSidebar, token, router]);

  // Show loading screen during rehydration or redirect check
  if (!isLoginPage && !hideSidebar && (!mounted || !token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
        <div className="w-10 h-10 border-4 border-accent-1 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-info font-medium text-xs">Verifying session...</p>
      </div>
    );
  }

  const noSidebar = isLoginPage || hideSidebar;

  return (
    <LayoutContext.Provider value={{ hideSidebar, setHideSidebar }}>
      {noSidebar ? (
        <main className="min-h-screen bg-background transition-colors duration-300">
          {children}
        </main>
      ) : (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background transition-colors duration-300">
          <ProportSidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      )}
    </LayoutContext.Provider>
  );
}
