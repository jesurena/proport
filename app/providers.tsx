'use client';

import React, { useEffect, useState } from 'react';
import { ensureSeeded } from '@/lib/tickets';
import QueryProvider from "@/components/Providers/query-provider";
import { ThemeProvider } from "@/components/Providers/theme-provider";
import { TelemetryProvider } from "@/components/Providers/telemetry-provider";

function SeedProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSeeded();
    setReady(true);
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <TelemetryProvider>
          <SeedProvider>
            {children}
          </SeedProvider>
        </TelemetryProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
