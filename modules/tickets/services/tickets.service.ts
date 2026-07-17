import api from '@/lib/api';

export const ticketsService = {
  async getTickets(params?: {
    page?: number;
    per_page?: number;
    tab?: string;
    search?: string;
    sort_by?: string;
    status?: string;
    brand_type?: string;
  }): Promise<{
    data: any[];
    total: number;
    current_page: number;
    last_page: number;
  }> {
    const { data } = await api.get('/tickets', { params });
    return data;
  },

  async getTicketById(id: string): Promise<any> {
    const { data } = await api.get(`/tickets/${id}`);
    return data;
  },

  async addReply(
    id: string,
    payload: { content: string; cc_ids?: string[]; status_action?: string }
  ): Promise<any> {
    const { data } = await api.post(`/tickets/${id}/reply`, payload);
    return data;
  },

  async updateAssignment(id: string, assignee_ids: string): Promise<any> {
    const { data } = await api.post(`/tickets/${id}/assign`, { assignee_ids });
    return data;
  },

  async updateStatus(id: string, status: string): Promise<any> {
    const { data } = await api.post(`/tickets/${id}/status`, { status });
    return data;
  },

  async getTicketHistory(id: string): Promise<any> {
    const { data } = await api.get(`/tickets/${id}/history`);
    return data;
  },
};
