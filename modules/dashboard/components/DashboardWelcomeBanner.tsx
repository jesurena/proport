import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function DashboardWelcomeBanner() {
  const handleCompose = () => {
    window.dispatchEvent(new CustomEvent('tcd-open-compose'));
  };

  return (
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
          onClick={handleCompose}
          className="flex items-center gap-3 px-5 py-2.5 bg-black text-white hover:bg-neutral-900 rounded-full font-semibold text-xs mt-6 transition-all select-none w-fit cursor-pointer"
        >
          <span>Compose Inquiry</span>
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black shrink-0">
            <ChevronRight size={12} className="stroke-[3]" />
          </div>
        </button>
      </div>
    </div>
  );
}
