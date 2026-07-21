import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/components/utils/cn';
import { useAuthStore } from '@/modules/auth';

interface DashboardWelcomeBannerProps {
  role?: string;
  counts?: any;
}

export default function DashboardWelcomeBanner({ role, counts }: DashboardWelcomeBannerProps) {
  const router = useRouter();
  const { is_head, is_adel } = useAuthStore();

  const handleAction = () => {
    if (is_adel) {
      router.push('/tickets?tab=final-approval');
    } else if (is_head) {
      router.push('/tickets?tab=bu-approval');
    } else if (role === 'sales') {
      window.dispatchEvent(new CustomEvent('tcd-open-compose'));
    } else {
      router.push('/tickets');
    }
  };

  const isSales = role === 'sales';

  let bannerColor = 'bg-[#6366f1]';
  if (is_adel) {
    bannerColor = 'bg-gradient-to-br from-violet-600 to-indigo-800';
  } else if (is_head) {
    bannerColor = 'bg-gradient-to-br from-emerald-600 to-cyan-800';
  } else if (role === 'sales') {
    bannerColor = 'bg-gradient-to-br from-indigo-500 to-purple-600';
  } else if (role === 'buyer') {
    bannerColor = 'bg-gradient-to-br from-emerald-500 to-teal-600';
  } else if (role === 'admin') {
    bannerColor = 'bg-gradient-to-br from-rose-500 to-amber-600';
  } else if (role === 'super_user') {
    bannerColor = 'bg-gradient-to-br from-purple-600 to-pink-600';
  }

  let tag = 'PROPORT · BUYER WORKSPACE';
  if (is_adel) {
    tag = 'PROPORT · EXECUTIVE DASHBOARD';
  } else if (is_head) {
    tag = 'PROPORT · BU HEAD DASHBOARD';
  } else if (isSales) {
    tag = 'PROPORT · PRICING TICKET HUB';
  }

  let welcomeMessage = "Welcome back! Help sales obtain the best price quotes from suppliers, resolve incoming tickets, and manage quotes.";
  if (is_adel) {
    welcomeMessage = "Welcome back, Ms. Adel. Access reports, monitor overall ticket status, and review final approval requests.";
  } else if (is_head) {
    welcomeMessage = "Welcome back! Monitor your business unit's ticket activities, endorse pending requests, and manage ticket queues.";
  } else if (isSales) {
    welcomeMessage = "Need help with product pricing or quotes? Submit a ticket and our buyers will get the best pricing options from suppliers.";
  }

  return (
    <div className={cn("rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-sm min-h-[200px] flex flex-col justify-center", bannerColor)}>
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
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 mb-3 block">
          {tag}
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight max-w-xl text-white">
          {welcomeMessage}
        </h2>
        <button
          onClick={handleAction}
          className="flex items-center gap-3 px-5 py-2.5 bg-black text-white hover:bg-neutral-900 rounded-full font-semibold text-xs mt-6 transition-all select-none w-fit cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {is_adel ? (
              <>
                For Final Approval
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px]">
                  {counts?.for_final_approval ?? 0}
                </span>
              </>
            ) : is_head ? (
              <>
                For BU Head Approval
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px]">
                  {counts?.for_bu_head_approval ?? 0}
                </span>
              </>
            ) : isSales ? (
              'Compose Ticket'
            ) : (
              'View Tickets'
            )}
          </span>
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black shrink-0">
            <ChevronRight size={12} className="stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
}
