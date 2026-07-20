'use client';

import React from 'react';
import { AppLabel } from '@integrated-computer-system/ui-kit';
import { AppSwitch } from '@/components/ui';
import { useDefaultAssignment, useUpdateDefaultAssignment } from '../../hooks/useSettings';

export default function AssignmentTab() {
  const { data: isDefaultAssigned = false, isLoading } = useDefaultAssignment(true);
  const updateMutation = useUpdateDefaultAssignment();

  const handleToggleDefaultAssignment = (checked: boolean) => {
    updateMutation.mutate(checked);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <AppLabel as="h3" variant="title">Default Ticket Assignment</AppLabel>
        <AppLabel as="p" variant="description" className="mt-1">
          Configure whether new incoming inquiries matching your category or brand scope should automatically be assigned to you as a default buyer.
        </AppLabel>
      </div>

      <div className="flex items-center justify-between gap-4 bg-neutral/5 p-5 rounded-2xl border border-border/40 max-w-lg select-none">
        <div className="space-y-0.5 flex-1 pr-4">
          <AppLabel as="p" className="text-xs font-bold text-foreground">
            Automatic Assignment
          </AppLabel>
          <AppLabel as="p" variant="description" className="text-[11px] leading-snug">
            Automatically assign me by default to new ticket submissions
          </AppLabel>
        </div>
        <AppSwitch
          checked={isDefaultAssigned}
          disabled={isLoading || updateMutation.isPending}
          onChange={handleToggleDefaultAssignment}
        />
      </div>
    </div>
  );
}
