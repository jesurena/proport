'use client';

import React from 'react';
import { AppEmptyState } from '@/components/ui';
import { ProportNavbar } from '@/modules/sidebar';

export default function ReportsPage() {
  return (
    <>
      <ProportNavbar title="Reports" />
      <div className="flex items-center justify-center h-[70vh] p-6">
        <AppEmptyState
          title="Reports Module is Under Construction"
          description="We are currently working on building this module, p  lease bear with us."
          imageSrc="/aria-mascott-wip.svg"
          imageSize={180}
        />
      </div>
    </>
  );
}
