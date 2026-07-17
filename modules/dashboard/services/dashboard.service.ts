import api from '@/lib/api';

export const dashboardService = {
  async getCounts(): Promise<{
    ticket_today: number;
    ticket_pending: number;
    ticket_open: number;
    ticket_closed: number;
    focus_ticket: number;
    nf_ticket: number;
  }> {
    const { data } = await api.get('/dashboard/counts');
    return data;
  },

  async getFocusBreakdown(): Promise<{ focus: number; non_focus: number; request_types: any[] }> {
    const { data } = await api.get('/dashboard/focus-breakdown');
    return data;
  },

  async getBookmarkedTickets(): Promise<any[]> {
    const { data } = await api.get('/dashboard/bookmarked-tickets');
    return data || [];
  },

  async getTicketCountAo(): Promise<any[]> {
    const { data } = await api.get('/dashboard/ticket-count-ao');
    return data.data || [];
  },

  async getChartPerBu(): Promise<any[]> {
    const { data } = await api.get('/dashboard/chart-per-bu');
    return data.data || [];
  },

  async getBuyerCategoryCounts(): Promise<any[]> {
    const { data } = await api.get('/dashboard/buyer-category-counts');
    return data.data || [];
  },

  async getBuyerDateCounts(fromDate?: string, toDate?: string): Promise<any[]> {
    const { data } = await api.get('/dashboard/buyer-date-counts', {
      params: { from_date: fromDate, to_date: toDate },
    });
    return data.data || [];
  },
};
