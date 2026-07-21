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

export interface BuHeadAging {
  on_track_count: number;
  overdue_count: number;
  overdue_tickets: Array<{
    ticket_id: number;
    subject: string;
    date_created: string;
    requestor_name: string;
    requestor_avatar: string | null;
    AccountGroup: string;
  }>;
}

export interface BuHeadGroupCreation {
  ticket_id: number;
  subject: string;
  date_created: string;
  requestor_name: string;
  requestor_avatar: string | null;
  AccountGroup: string;
}

export const buHeadService = {
  async getCounts(): Promise<BuHeadCounts> {
    const { data } = await api.get('/dashboard/bu-head-counts');
    return data;
  },

  async getAging(): Promise<BuHeadAging> {
    const { data } = await api.get('/dashboard/bu-head-aging');
    return data;
  },

  async getGroupCreations(): Promise<BuHeadGroupCreation[]> {
    const { data } = await api.get('/dashboard/bu-head-group-creations');
    return data;
  },
};
