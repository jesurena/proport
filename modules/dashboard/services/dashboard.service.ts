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

  async getBookmarkedTickets(ids?: string): Promise<any[]> {
    const { data } = await api.get('/dashboard/bookmarked-tickets', { params: { ids } });
    return data || [];
  },

  async getTicketCountAo(params?: {
    page?: number;
    per_page?: number;
    sort_field?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<{ data: any[]; total: number }> {
    const { data } = await api.get('/dashboard/ticket-count-ao', { params });
    return data;
  },

  async getChartPerBu(): Promise<any[]> {
    const { data } = await api.get('/dashboard/chart-per-bu');
    return data.data || [];
  },

  async getBuyerCategoryCounts(params?: {
    page?: number;
    per_page?: number;
    sort_field?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<{ data: any[]; total: number }> {
    const { data } = await api.get('/dashboard/buyer-category-counts', { params });
    return data;
  },

  async getBuyerDateCounts(params?: {
    from_date?: string;
    to_date?: string;
    page?: number;
    per_page?: number;
    sort_field?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<{ data: any[]; total: number }> {
    const { data } = await api.get('/dashboard/buyer-date-counts', { params });
    return data;
  },

  async getSalesDateCounts(params?: {
    page?: number;
    per_page?: number;
    sort_field?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<{ data: any[]; total: number }> {
    const { data } = await api.get('/dashboard/sales-date-counts', { params });
    return data;
  },

  async getBuyerPeriodCounts(): Promise<{ today: any[]; week: any[] }> {
    const { data } = await api.get('/dashboard/buyer-period-counts');
    return data.data;
  },

  async getBuyerPeriodTickets(buyer: string, period: 'today' | 'week'): Promise<any[]> {
    const { data } = await api.get('/dashboard/buyer-period-tickets', {
      params: { buyer, period },
    });
    return data.data || [];
  },

  async getRecentTickets(): Promise<any[]> {
    const { data } = await api.get('/dashboard/recent-tickets');
    return data.data || [];
  },
};
