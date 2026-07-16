import type { TicketStatus } from '@/modules/tickets';

export interface StatusCount {
  status: TicketStatus;
  count: number;
}

export interface BusinessUnitCount {
  businessUnit: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;    // e.g. "Jan", "Feb"
  year: number;
  count: number;
}
