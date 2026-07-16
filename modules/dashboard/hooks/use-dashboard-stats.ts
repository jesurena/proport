import { useMemo } from 'react';
import type { StatusCount, BusinessUnitCount, MonthlyTrend, Ticket as TicketType } from '@/lib/types';

export const useDashboardStats = (allTickets: TicketType[]) => {
  const statusCounts = useMemo<StatusCount[]>(() => {
    const ALL_STATUSES: any[] = ['unassigned', 'assigned', 'pending', 'answered', 'closed', 'bu-approval', 'bu-declined', 'final-approval', 'adel-declined'];
    return ALL_STATUSES.map((status) => ({
      status,
      count: allTickets.filter((t) => t.status === status).length,
    }));
  }, [allTickets]);

  const buCounts = useMemo<BusinessUnitCount[]>(() => {
    const buMap = new Map<string, number>();
    allTickets.forEach((t) => {
      buMap.set(t.businessUnitName, (buMap.get(t.businessUnitName) || 0) + 1);
    });
    return Array.from(buMap.entries()).map(([businessUnit, count]) => ({
      businessUnit,
      count,
    }));
  }, [allTickets]);

  const monthlyTrend = useMemo<MonthlyTrend[]>(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const trendResult = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const count = allTickets.filter((t) => {
        const created = new Date(t.createdAt);
        return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
      }).length;
      trendResult.push({ month, year, count });
    }
    return trendResult;
  }, [allTickets]);

  const totalCount = allTickets.length;
  const openCount = useMemo(() => allTickets.filter((t) => t.status !== 'closed').length, [allTickets]);

  const avgHandling = useMemo(() => {
    const closedTickets = allTickets.filter((t) => t.closedAt);
    if (closedTickets.length > 0) {
      const totalHours = closedTickets.reduce((sum, t) => {
        const created = new Date(t.createdAt).getTime();
        const closed = new Date(t.closedAt!).getTime();
        return sum + (closed - created) / (1000 * 60 * 60);
      }, 0);
      return Math.round(totalHours / closedTickets.length);
    }
    return 0;
  }, [allTickets]);

  const getCount = (status: string) => {
    return statusCounts.find((s) => s.status === status)?.count || 0;
  };

  return {
    statusCounts,
    buCounts,
    monthlyTrend,
    totalCount,
    openCount,
    avgHandling,
    getCount,
  };
};
