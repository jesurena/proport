import api from '@/lib/api';
import { useAuthStore } from '@/modules/auth';

export const ticketsService = {
  async getTickets(params?: {
    page?: number;
    per_page?: number;
    tab?: string;
    search?: string;
    sort_by?: string;
    status?: string;
    brand_type?: string;
    my_tickets?: string;
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
    payload: { content: string; cc_ids?: string[]; status_action?: string; files?: File[] }
  ): Promise<any> {
    const { files, ...fields } = payload;

    if (files && files.length > 0) {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, String(v)));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      files.forEach((file) => formData.append('files[]', file));
      const { data } = await api.post(`/tickets/${id}/reply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }

    const { data } = await api.post(`/tickets/${id}/reply`, fields);
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

  async getTicketAssignees(id: string): Promise<{ assigned: any[]; available: any[] }> {
    const { data } = await api.get(`/tickets/${id}/assignees`);
    return data;
  },

  async getCcUsers(): Promise<any[]> {
    const { data } = await api.get('/cc-users');
    return data;
  },

  async searchTickets(search: string): Promise<any[]> {
    const { data } = await api.get('/tickets/search', { params: { search } });
    return data;
  },

  async getUserProfile(id: string): Promise<any> {
    const { data } = await api.get(`/users/${id}/profile`);
    return data?.data ?? data;
  },

  getAttachmentUrl(fileName: string): string {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
    const { token } = useAuthStore.getState();
    const encoded = encodeURIComponent(btoa(fileName));
    return `${apiBase}/attachments/view/${encoded}?token=${token}`;
  },
};
