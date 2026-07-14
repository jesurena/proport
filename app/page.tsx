'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, Clock, Users, ChevronRight, ChevronLeft, MoreHorizontal, Inbox, CircleDot, ArrowRight, Plus, CheckCircle2, XCircle, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { ProportNavbar } from '@/modules/sidebar';
import { AppToggle } from '@/components/ui';
import { AppLabel } from '@integrated-computer-system/ui-kit';
import StatCard from '@/components/dashboard/StatCard';
import TicketStatusGrid from '@/components/dashboard/TicketStatusGrid';
import RecentTickets from '@/components/dashboard/RecentTickets';
import {
  getTicketCountByStatus,
  getOpenTicketCount,
  getTotalTicketCount,
  getAvgHandlingTimeHours,
  getTicketCountByBusinessUnit,
  getMonthlyTrend,
} from '@/lib/stats';
import { getSuppliers } from '@/lib/suppliers';
import { getTickets } from '@/lib/tickets';
import type { StatusCount, BusinessUnitCount, MonthlyTrend, Ticket as TicketType, TicketStatus } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [buCounts, setBuCounts] = useState<BusinessUnitCount[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [recentTickets, setRecentTickets] = useState<TicketType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openCount, setOpenCount] = useState(0);
  const [avgHandling, setAvgHandling] = useState(0);

  // Price/Supplier stats
  const [inquiryTypes, setInquiryTypes] = useState<Record<string, number>>({});
  const [supplierCounts, setSupplierCounts] = useState<Record<string, number>>({});
  const [buyerAverages, setBuyerAverages] = useState<{ name: string; avg: number; count: number }[]>([]);
  const [buyerWeeklyGrid, setBuyerWeeklyGrid] = useState<Record<string, number[]>>({});

  const [allTickets, setAllTickets] = useState<TicketType[]>([]);
  const [showAllCards, setShowAllCards] = useState(false);
  const [buyerPeriod, setBuyerPeriod] = useState<'today' | 'week'>('today');
  const [showAllBuyers, setShowAllBuyers] = useState(false);

  useEffect(() => {
    setStatusCounts(getTicketCountByStatus());
    setBuCounts(getTicketCountByBusinessUnit());
    setMonthlyTrend(getMonthlyTrend());
    setTotalCount(getTotalTicketCount());
    setOpenCount(getOpenTicketCount());
    setAvgHandling(getAvgHandlingTimeHours());

    const allTickets = getTickets();
    setAllTickets(allTickets);
    setRecentTickets(
      [...allTickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 6)
    );

    // ─── 1. Categorize Price Inquiries ───
    const categories: Record<string, number> = {
      'Standard Price Query': 0,
      'Volume Discount': 0,
      'Custom Quote': 0,
      'Supplier Match': 0,
      'General Price Inquiry': 0,
    };
    allTickets.forEach((t) => {
      const text = `${t.subject} ${t.description}`.toLowerCase();
      if (text.includes('discount') || text.includes('volume') || text.includes('seats')) {
        categories['Volume Discount']++;
      } else if (text.includes('match') || text.includes('competitor') || text.includes('beat')) {
        categories['Supplier Match']++;
      } else if (text.includes('custom') || text.includes('quote') || text.includes('quotation')) {
        categories['Custom Quote']++;
      } else if (text.includes('price inquiry') || text.includes('price check') || text.includes('cost') || text.includes('pricing')) {
        categories['Standard Price Query']++;
      } else {
        categories['General Price Inquiry']++;
      }
    });
    setInquiryTypes(categories);

    // ─── 2. Supplier Breakdown ───
    const supplierTotals: Record<string, number> = {};
    const trackSupplier = (sup: string) => {
      supplierTotals[sup] = (supplierTotals[sup] || 0) + 1;
    };
    allTickets.forEach((t) => {
      if (t.supplierName) {
        trackSupplier(t.supplierName);
      } else {
        trackSupplier('Other');
      }
    });
    setSupplierCounts(supplierTotals);

    // ─── 3. Avg Handling Time per Buyer ───
    const closed = allTickets.filter((t) => t.closedAt && t.assigneeId);
    const buyerTimes: Record<string, { totalHours: number; count: number }> = {};
    closed.forEach((t) => {
      const hrs = (new Date(t.closedAt!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60);
      if (!buyerTimes[t.assigneeName!]) {
        buyerTimes[t.assigneeName!] = { totalHours: 0, count: 0 };
      }
      buyerTimes[t.assigneeName!].totalHours += hrs;
      buyerTimes[t.assigneeName!].count++;
    });
    const buyerAvg = Object.entries(buyerTimes).map(([name, val]) => ({
      name,
      avg: Math.round((val.totalHours / val.count) * 10) / 10,
      count: val.count,
    }));
    // Default mock buyers if no tickets are closed
    if (buyerAvg.length === 0) {
      buyerAvg.push({ name: 'Maria Santos', avg: 4.5, count: 2 });
      buyerAvg.push({ name: 'Rico Mendoza', avg: 12.0, count: 1 });
    }
    setBuyerAverages(buyerAvg);

    // ─── 4. Buyer Weekly Matrix ───
    const weeklyMatrix: Record<string, number[]> = {
      'Maria Santos': [0, 0, 0, 0, 0, 0, 0],
      'Rico Mendoza': [0, 0, 0, 0, 0, 0, 0],
      'Unassigned': [0, 0, 0, 0, 0, 0, 0],
    };
    allTickets.forEach((t) => {
      const day = new Date(t.createdAt).getDay();
      const name = t.assigneeName || 'Unassigned';
      if (weeklyMatrix[name]) {
        weeklyMatrix[name][day]++;
      }
    });
    setBuyerWeeklyGrid(weeklyMatrix);
  }, []);

  const closedCount = statusCounts.find((s) => s.status === 'closed')?.count || 0;
  const getCount = (status: string) => statusCounts.find((s) => s.status === status)?.count || 0;

  const supplierCards = Object.entries(supplierCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Donut percent: focus / total
  const focusStatuses = ['pending', 'answered', 'closed', 'reassigned'];
  const focusCount = allTickets.filter((t) => focusStatuses.includes(t.status)).length;
  const nonFocusCount = allTickets.length - focusCount;
  const focusPct = allTickets.length > 0 ? Math.round((focusCount / allTickets.length) * 100) : 0;
  const nonFocusPct = 100 - focusPct;
  const circumference = 2 * Math.PI * 40; // r=40
  const dashOffset = circumference - (focusPct / 100) * circumference;

  return (
    <>
      <ProportNavbar title="Dashboard" />

      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Two-column layout */}
        <div className="flex flex-col xl:flex-row gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Welcome Banner */}
            <div className="rounded-3xl bg-[#6366f1] p-8 md:p-10 text-white relative overflow-hidden shadow-sm min-h-[200px] flex flex-col justify-center">
              <svg className="absolute right-[10%] top-[10%] w-36 h-36 text-white/20 blur-[0.5px] pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
              </svg>
              <svg className="absolute right-[5%] top-[25%] w-10 h-10 text-white/10 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
              </svg>
              <svg className="absolute right-[25%] top-[60%] w-12 h-12 text-white/10 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
              </svg>
              <div className="relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 mb-3 block">PROPORT · PRICING INQUIRY HUB</span>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight max-w-xl text-white">
                  Need help with product pricing or quotes? Submit an inquiry and our buyers will get the best pricing options from suppliers.
                </h2>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('tcd-open-compose'))}
                  className="flex items-center gap-3 px-5 py-2.5 bg-black text-white hover:bg-neutral-900 rounded-full font-semibold text-xs mt-6 transition-all select-none w-fit cursor-pointer"
                >
                  <span>Compose Inquiry</span>
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black shrink-0">
                    <ChevronRight size={12} className="stroke-[3]" />
                  </div>
                </button>
              </div>
            </div>

            {/* Metric Cards Row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-info uppercase tracking-wider">Status Overview</span>
                <button
                  onClick={() => setShowAllCards(!showAllCards)}
                  className="text-xs font-semibold text-accent-1 hover:underline cursor-pointer select-none"
                >
                  {showAllCards ? 'Show Less (Retract)' : 'View All'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 transition-all duration-300">
                {/* The first 3 cards are always shown */}
                {[
                  { label: 'Unassigned', status: 'unassigned', icon: <Inbox size={18} />, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-600' },
                  { label: 'Assigned', status: 'assigned', icon: <CircleDot size={18} />, iconBg: 'bg-pink-500/10', iconColor: 'text-pink-600' },
                  { label: 'Pending', status: 'pending', icon: <Clock size={18} />, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600' },
                ].map(({ label, status, icon, iconBg, iconColor }) => (
                  <div
                    key={status}
                    onClick={() => router.push(`/tickets?status=${status}`)}
                    className="bg-card-bg border border-border/60 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-hover/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-text-info uppercase tracking-wider leading-none mb-1">
                          {getCount(status)}/{totalCount} inquiries
                        </p>
                        <p className="text-sm font-bold text-text">{label}</p>
                      </div>
                    </div>
                    <MoreHorizontal className="text-text-info cursor-pointer shrink-0" size={16} />
                  </div>
                ))}

                {/* Show the remaining 3 cards (total of 6) only when expanded */}
                {showAllCards && (
                  <>
                    {[
                      { label: 'Answered', status: 'answered', icon: <CheckCircle2 size={18} />, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
                      { label: 'Closed', status: 'closed', icon: <XCircle size={18} />, iconBg: 'bg-slate-500/10', iconColor: 'text-slate-600' },
                      { label: 'Escalated', status: 'escalated', icon: <AlertTriangle size={18} />, iconBg: 'bg-red-500/10', iconColor: 'text-red-600' },
                    ].map(({ label, status, icon, iconBg, iconColor }) => (
                      <div
                        key={status}
                        onClick={() => router.push(`/tickets?status=${status}`)}
                        className="bg-card-bg border border-border/60 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-hover/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
                            {icon}
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-text-info uppercase tracking-wider leading-none mb-1">
                              {getCount(status)}/{totalCount} inquiries
                            </p>
                            <p className="text-sm font-bold text-text">{label}</p>
                          </div>
                        </div>
                        <MoreHorizontal className="text-text-info cursor-pointer shrink-0" size={16} />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Supplier Inquiries */}
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

            {/* Inquiries list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h3 className="text-base font-bold text-text">Your Inquiries</h3>
                <span onClick={() => router.push('/tickets')} className="text-xs font-semibold text-accent-1 hover:underline cursor-pointer">See all</span>
              </div>

              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[2fr_1.2fr_3fr_40px] gap-4 px-4 text-[10px] uppercase font-semibold text-text-info tracking-wider">
                <span>Buyer</span>
                <span>Supplier</span>
                <span>Subject</span>
                <span>Action</span>
              </div>

              <div className="space-y-1.5">
                {recentTickets.slice(0, 5).map((ticket) => {
                  let categoryBg = 'bg-neutral border border-border/40 text-text';
                  if (ticket.supplierName === 'Ingram Micro') categoryBg = 'bg-sky-500/10 text-sky-600';
                  else if (ticket.supplierName === 'Synnex') categoryBg = 'bg-cyan-500/10 text-cyan-600';
                  else if (ticket.supplierName === 'Tech Data') categoryBg = 'bg-indigo-500/10 text-indigo-600';

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className="grid grid-cols-1 sm:grid-cols-[2fr_1.2fr_3fr_40px] gap-4 items-center p-3 rounded-2xl border border-border/30 hover:border-border/60 bg-card-bg hover:bg-hover/20 transition-all cursor-pointer shadow-sm"
                    >
                      {/* Assignee / Buyer */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-neutral flex items-center justify-center font-bold text-xs text-text-info shrink-0">
                          {ticket.assigneeName ? ticket.assigneeName.substring(0, 2).toUpperCase() : 'UN'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text leading-none mb-0.5">{ticket.assigneeName || 'Unassigned'}</p>
                          <p className="text-[10px] text-text-info">
                            {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {/* Supplier */}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit ${categoryBg}`}>
                        {ticket.supplierName || 'General'}
                      </span>
                      {/* Subject */}
                      <span className="text-xs font-medium text-text truncate">{ticket.subject}</span>
                      {/* Action */}
                      <button className="w-8 h-8 rounded-full border border-border/60 hover:bg-accent-1 hover:text-white flex items-center justify-center text-text-info transition-colors cursor-pointer shrink-0">
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="xl:w-[300px] shrink-0 space-y-4">

            {/* Inquiry Focus Breakdown Card */}
            <div className="bg-card-bg border border-border/60 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <AppLabel as="h4" variant="title" className="!text-sm !font-bold">Inquiry Focus Breakdown</AppLabel>
                  <AppLabel as="p" variant="description" className="text-[10px] mt-0.5">Focus vs Non-Focus share in inquiries</AppLabel>
                </div>
                <MoreHorizontal size={16} className="text-text-info cursor-pointer" />
              </div>

              {/* Donut chart */}
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle represents the Non-Focus share (pink color) */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="10" />
                    {/* Foreground circle represents the Focus share (indigo color) */}
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#6366f1" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-700"
                    />
                  </svg>
                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-md select-none flex-col leading-none">
                      <AppLabel as="span" className="text-white font-bold text-base leading-none">{focusPct}%</AppLabel>
                      <AppLabel as="span" className="text-[9px] font-semibold text-white/80 mt-0.5 leading-none">Focus</AppLabel>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <AppLabel as="p" className="text-sm font-bold text-text">Demand split this week</AppLabel>
                  <AppLabel as="p" variant="description" className="text-[11px] mt-0.5">Ratio of focused status vs other requests.</AppLabel>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="rounded-2xl border border-border/50 bg-hover/30 px-3 py-2 text-center">
                  <AppLabel as="p" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Focus</AppLabel>
                  <AppLabel as="p" className="text-sm font-bold text-text mt-0.5">{focusCount} ({focusPct}%)</AppLabel>
                </div>
                <div className="rounded-2xl border border-border/50 bg-hover/30 px-3 py-2 text-center">
                  <AppLabel as="p" className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Non-Focus</AppLabel>
                  <AppLabel as="p" className="text-sm font-bold text-text mt-0.5">{nonFocusCount} ({nonFocusPct}%)</AppLabel>
                </div>
              </div>
            </div>

            {/* Ticket per Buyer List Card */}
            {(() => {
              const buyersList = [
                'Maria Santos',
                'Rico Mendoza',
                'John Dela Cruz',
                'Angela Reyes',
                'Carlos Garcia',
                'Patricia Lim',
                'Jose Ramos',
                'Unassigned'
              ];

              const filteredPeriodTickets = allTickets.filter((t) => {
                if (buyerPeriod === 'today') {
                  const todayStr = new Date().toISOString().split('T')[0];
                  return t.createdAt.startsWith(todayStr);
                } else {
                  const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
                  return new Date(t.createdAt) >= oneWeekAgo;
                }
              });

              const buyerCounts = buyersList.map((name) => {
                let count = 0;
                if (name === 'Unassigned') {
                  count = filteredPeriodTickets.filter(t => !t.assigneeId).length;
                } else {
                  count = filteredPeriodTickets.filter(t => t.assigneeName === name).length;
                }
                return { name, count };
              }).sort((a, b) => b.count - a.count);

              const displayedBuyers = showAllBuyers ? buyerCounts : buyerCounts.slice(0, 5);

              return (
                <div className="bg-card-bg border border-border/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <AppLabel as="h4" variant="title" className="!text-sm !font-bold mr-2">Ticket per Buyer</AppLabel>
                      <AppToggle
                        options={[
                          { label: 'Today', value: 'today' },
                          { label: 'This Week', value: 'week' },
                        ]}
                        value={buyerPeriod}
                        onChange={setBuyerPeriod}
                      />
                    </div>
                    <AppLabel as="p" variant="description" className="text-[10px]">Inquiry distribution per buyer assignee for the selected range.</AppLabel>
                  </div>

                  <div className="space-y-3">
                    {displayedBuyers.map((buyer, index) => (
                      <div key={buyer.name} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${index === 0 ? 'bg-linear-to-br from-indigo-400 to-purple-500' : index === 1 ? 'bg-linear-to-br from-sky-400 to-blue-500' : 'bg-linear-to-br from-emerald-400 to-teal-500'}`}>
                            {buyer.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <AppLabel as="p" className="text-xs font-bold text-text leading-none mb-0.5">{buyer.name}</AppLabel>
                            <AppLabel as="p" variant="description" className="text-[10px]">
                              {buyer.count} inquir{buyer.count === 1 ? 'y' : 'ies'} {buyerPeriod === 'today' ? 'today' : 'this week'}
                            </AppLabel>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(buyer.name === 'Unassigned' ? '/tickets?status=unassigned' : `/tickets?assigneeName=${encodeURIComponent(buyer.name)}`)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-accent-1/30 text-accent-1 text-[10px] font-bold hover:bg-accent-1 hover:text-white transition-colors cursor-pointer shrink-0"
                        >
                          <Users size={10} />
                          View
                        </button>
                      </div>
                    ))}
                  </div>

                  {buyerCounts.length > 5 && (
                    <button
                      onClick={() => setShowAllBuyers(!showAllBuyers)}
                      className="w-full mt-2 py-2 rounded-2xl border border-border/60 text-xs font-semibold text-text hover:bg-hover transition-colors cursor-pointer"
                    >
                      {showAllBuyers ? 'Show Less (Retract)' : 'See All Buyers'}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </>
  );
}
