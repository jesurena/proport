'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ProportSidebar } from '@/modules/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

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
