'use client';

import React from 'react';
import { AppEmptyState } from '@integrated-computer-system/ui-kit';
import { FileBarChart } from 'lucide-react';
import { ProportNavbar } from '@/modules/sidebar';

export default function ReportsPage() {
  return (
    <>
      <ProportNavbar title="Reports" />
      <div className="flex items-center justify-center h-[70vh] p-6">
        <AppEmptyState
          title="Reports Coming Soon"
          description="We're building powerful reporting features including inquiry analytics, trend analysis, and exportable datasheets."
          icon={FileBarChart}
        />
      </div>
    </>
  );
}
