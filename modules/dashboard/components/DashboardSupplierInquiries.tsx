import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Ticket as TicketType } from '@/lib/types';

interface DashboardSupplierInquiriesProps {
  recentTickets: TicketType[];
}

export default function DashboardSupplierInquiries({ recentTickets }: DashboardSupplierInquiriesProps) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-text">Recent Supplier Inquiries</h3>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center hover:bg-hover transition-colors text-text-info hover:text-text cursor-pointer">
            <ChevronLeft size={14} />
          </button>
          <button className="w-7 h-7 rounded-full bg-accent-1 text-white flex items-center justify-center hover:bg-accent-1/90 transition-colors cursor-pointer">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recentTickets.slice(0, 3).map((ticket) => {
          let badgeColor = 'bg-purple-500/10 text-purple-600';
          let gradient = 'from-purple-600 to-indigo-600';
          if (ticket.supplierName === 'Ingram Micro') {
            badgeColor = 'bg-sky-500/10 text-sky-600';
            gradient = 'from-sky-500 to-blue-600';
          } else if (ticket.supplierName === 'Synnex') {
            badgeColor = 'bg-cyan-500/10 text-cyan-600';
            gradient = 'from-cyan-600 to-blue-500';
          } else if (ticket.supplierName === 'Tech Data') {
            badgeColor = 'bg-indigo-500/10 text-indigo-600';
            gradient = 'from-indigo-500 to-violet-600';
          } else if (ticket.supplierName === 'Arrow Electronics') {
            badgeColor = 'bg-emerald-500/10 text-emerald-600';
            gradient = 'from-emerald-600 to-teal-700';
          }

          return (
            <div
              key={ticket.id}
              onClick={() => router.push(`/tickets/${ticket.id}`)}
              className="bg-card-bg border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className={`w-full h-36 bg-linear-to-br ${gradient} relative flex items-center justify-center`}>
                <span className="text-xs font-mono font-bold tracking-widest text-white/30">
                  #{String(ticket.ticketNumber).padStart(4, '0')}
                </span>
                <div className="absolute right-3 top-3 w-7 h-7 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={14} />
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <h4 className="text-sm font-bold text-text line-clamp-2 leading-snug group-hover:text-accent-1 transition-colors">
                  {ticket.subject}
                </h4>
                <div className="flex items-center gap-1.5 mt-auto pt-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${badgeColor}`}>
                    {ticket.supplierName || 'General'}
                  </span>
                  {ticket.estimatedQuantity !== undefined && (
                    <span className="text-[10px] font-semibold text-text-info bg-neutral px-2 py-1 rounded-full">
                      Qty: {ticket.estimatedQuantity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
