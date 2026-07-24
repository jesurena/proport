import api from '@/lib/api';

export const bookmarkService = {
  async getBookmarks(): Promise<any[]> {
    const { data } = await api.get('/tickets/bookmarks');
    return data || [];
  },

  async addBookmark(ticketId: number): Promise<any> {
    const { data } = await api.post('/tickets/bookmarks', { ticket_id: ticketId });
    return data;
  },

  async removeBookmark(ticketId: number): Promise<any> {
    const { data } = await api.delete(`/tickets/bookmarks/${ticketId}`);
    return data;
  },
};
