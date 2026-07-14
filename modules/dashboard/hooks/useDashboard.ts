import { useState, useEffect } from 'react';
import {
  getTicketCountByStatus,
  getOpenTicketCount,
  getTotalTicketCount,
  getAvgHandlingTimeHours,
  getTicketCountByBusinessUnit,
  getMonthlyTrend,
} from '@/lib/stats';
import { getTickets } from '@/lib/tickets';
import type { StatusCount, BusinessUnitCount, MonthlyTrend, Ticket as TicketType } from '@/lib/types';

export function useDashboard() {
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

  useEffect(() => {
    setStatusCounts(getTicketCountByStatus());
    setBuCounts(getTicketCountByBusinessUnit());
    setMonthlyTrend(getMonthlyTrend());
    setTotalCount(getTotalTicketCount());
    setOpenCount(getOpenTicketCount());
    setAvgHandling(getAvgHandlingTimeHours());

    const tickets = getTickets();
    setAllTickets(tickets);
    setRecentTickets(
      [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 6)
    );

    // ─── 1. Categorize Price Inquiries ───
    const categories: Record<string, number> = {
      'Standard Price Query': 0,
      'Volume Discount': 0,
      'Custom Quote': 0,
      'Supplier Match': 0,
      'General Price Inquiry': 0,
    };
    tickets.forEach((t) => {
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
    tickets.forEach((t) => {
      if (t.supplierName) {
        trackSupplier(t.supplierName);
      } else {
        trackSupplier('Other');
      }
    });
    setSupplierCounts(supplierTotals);

    // ─── 3. Avg Handling Time per Buyer ───
    const closed = tickets.filter((t) => t.closedAt && t.assigneeId);
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
    tickets.forEach((t) => {
      const day = new Date(t.createdAt).getDay();
      const name = t.assigneeName || 'Unassigned';
      if (weeklyMatrix[name]) {
        weeklyMatrix[name][day]++;
      }
    });
    setBuyerWeeklyGrid(weeklyMatrix);
  }, []);

  const getCount = (status: string) => {
    return statusCounts.find((s) => s.status === status)?.count || 0;
  };

  return {
    statusCounts,
    buCounts,
    monthlyTrend,
    recentTickets,
    totalCount,
    openCount,
    avgHandling,
    inquiryTypes,
    supplierCounts,
    buyerAverages,
    buyerWeeklyGrid,
    allTickets,
    getCount,
  };
}
