import api from '@/lib/api';

export interface AdelCounts {
  ticket_today: number;
  ticket_pending: number;
  focus_ticket: number;
  nf_ticket: number;
  ticket_open: number;
  ticket_closed: number;
  for_final_approval: number;
}

export const adelService = {
  async getCounts(): Promise<AdelCounts> {
    const { data } = await api.get('/dashboard/adel-counts');
    return data;
  },
};
