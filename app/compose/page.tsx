'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Compose is now a global floating modal triggered from the sidebar.
// This page redirects back and fires the compose event.
export default function ComposePage() {
  const router = useRouter();

  useEffect(() => {
    // Go back to wherever user came from and open the compose modal
    router.back();
    // Fire after a tick so the sidebar listener is ready
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('tcd-open-compose'));
    }, 100);
  }, []);

  return null;
}
