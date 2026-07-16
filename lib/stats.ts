import { StatusCount, BusinessUnitCount, MonthlyTrend, TicketStatus } from './types';
import { getTickets } from './tickets';

const ALL_STATUSES: TicketStatus[] = [
  'unassigned', 'assigned', 'pending', 'answered', 'closed', 'reassigned',
];

export function getTicketCountByStatus(): StatusCount[] {
  const tickets = getTickets();
  return ALL_STATUSES.map((status) => ({
    status,
    count: tickets.filter((t) => t.status === status).length,
  }));
}

export function getOpenTicketCount(): number {
  const tickets = getTickets();
  return tickets.filter((t) => t.status !== 'closed').length;
}

export function getTicketCountByBusinessUnit(): BusinessUnitCount[] {
  const tickets = getTickets();
  const map = new Map<string, number>();
  tickets.forEach((t) => {
    map.set(t.businessUnitName, (map.get(t.businessUnitName) || 0) + 1);
  });
  return Array.from(map.entries()).map(([businessUnit, count]) => ({
    businessUnit,
    count,
  }));
}

export function getMonthlyTrend(): MonthlyTrend[] {
  const tickets = getTickets();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const result: MonthlyTrend[] = [];

  // Last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const count = tickets.filter((t) => {
      const created = new Date(t.createdAt);
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
    }).length;
    result.push({ month, year, count });
  }

  return result;
}

export function getAvgHandlingTimeHours(): number {
  const tickets = getTickets().filter((t) => t.closedAt);
  if (tickets.length === 0) return 0;

  const totalHours = tickets.reduce((sum, t) => {
    const created = new Date(t.createdAt).getTime();
    const closed = new Date(t.closedAt!).getTime();
    return sum + (closed - created) / (1000 * 60 * 60);
  }, 0);

  return Math.round(totalHours / tickets.length);
}

export function getTotalTicketCount(): number {
  return getTickets().length;
}
