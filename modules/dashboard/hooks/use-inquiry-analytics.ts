import { useMemo } from 'react';
import type { Ticket as TicketType } from '@/lib/types';

export const useInquiryAnalytics = (allTickets: TicketType[]) => {
  const inquiryTypes = useMemo<Record<string, number>>(() => {
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
    return categories;
  }, [allTickets]);

  const supplierCounts = useMemo<Record<string, number>>(() => {
    const supplierTotals: Record<string, number> = {};
    allTickets.forEach((t) => {
      const sup = t.supplierName || 'Other';
      supplierTotals[sup] = (supplierTotals[sup] || 0) + 1;
    });
    return supplierTotals;
  }, [allTickets]);

  return {
    inquiryTypes,
    supplierCounts,
  };
};
