'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppLabel, AppCard, AppAvatar } from '@/components/ui';
import AppEmptyState from '@/components/ui/empty-state/AppEmptyState';
import { useBuHeadGroupCreations } from '../hooks/useBuHead';
import type { BuHeadGroupCreation } from '../services/bu-head.service';
import { DashboardGroupTicketCreationsSkeleton } from '@/components/skeleton/dashboard';

export default function DashboardGroupTicketCreations() {
  const router = useRouter();
  const { data: creations = [], isLoading } = useBuHeadGroupCreations();

  return (
    <AppCard variant="default" padding="md" className="space-y-3">
      <div>
        <AppLabel as="h4" variant="title" className="!text-sm !font-bold">
          Logs of My Group
        </AppLabel>
        <AppLabel as="p" variant="description" className="text-[10px] mt-0.5">
          Recent ticket creations in department
        </AppLabel>
      </div>

      {isLoading ? (
        <DashboardGroupTicketCreationsSkeleton count={3} />
      ) : creations.length === 0 ? (
        <AppEmptyState
          title="No recent ticket creations"
          description="Ticket creations in your group will appear here."
          imageSrc="/aria-mascott-sad.svg"
          imageSize={50}
          className="py-4 border-none bg-transparent"
        />
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {creations.map((t: BuHeadGroupCreation) => {
            return (
              <div
                key={t.ticket_id}
                onClick={() => router.push(`/tickets/${t.ticket_id}`)}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-border/50 bg-hover/20 hover:bg-hover/50 transition-colors cursor-pointer group"
              >
                {/* Requestor Avatar */}
                <AppAvatar
                  name={t.requestor_name}
                  src={t.requestor_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${t.requestor_name}`}
                  size={32}
                  className="shrink-0"
                />

                {/* Ticket ID, Subject & Requestor */}
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[9px] font-bold text-text-info block">
                    #{String(t.ticket_id).padStart(4, '0')}
                  </span>
                  <AppLabel
                    as="span"
                    className="block text-xs font-bold text-text truncate group-hover:text-accent-1 transition-colors mt-0.5"
                  >
                    {t.subject}
                  </AppLabel>
                  <AppLabel
                    as="span"
                    className="block text-[10px] text-text-info/70 truncate mt-0.5"
                  >
                    {t.requestor_name}
                  </AppLabel>
                </div>

                {/* Date Display */}
                <span className="text-[10px] font-mono font-semibold text-text-info/60 shrink-0">
                  {t.date_created ? String(t.date_created).substring(0, 10) : ''}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </AppCard>
  );
}
