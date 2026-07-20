import api from '@/lib/api';

export interface BuHeadCounts {
  ticket_today: number;
  ticket_pending: number;
  focus_ticket: number;
  nf_ticket: number;
  ticket_open: number;
  ticket_closed: number;
  for_bu_head_approval: number;
}

export const buHeadService = {
  async getCounts(): Promise<BuHeadCounts> {
    const { data } = await api.get('/dashboard/bu-head-counts');
    return data;
  },
};
