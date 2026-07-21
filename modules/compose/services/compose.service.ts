import api from '@/lib/api';

export interface ComposeInitData {
  request_types: { request_type_id: number; request_type: string }[];
  transaction_types: { transaction_type_id: number; transaction_description: string }[];
  account_owners: { account_id: number; AccountName: string; Email: string; AccountGroup: string }[];
}

export const composeService = {
  async getComposeInitData(): Promise<ComposeInitData> {
    const { data } = await api.get('/tickets/compose/init');
    return data;
  },

  async getBrandsByTType(tid: number): Promise<{ brand_id: number; brand: string }[]> {
    const { data } = await api.get('/tickets/compose/brands', { params: { tid } });
    return data.data;
  },

  async createTicket(payload: {
    subject: string;
    requestContent: string;
    customerID: string;
    customerName: string;
    projectName: string;
    tTypeID: number;
    aoID: string;
    requestTypeID: number;
    brandID: number[];
    ccID?: string[];
    files?: File[];
  }): Promise<{ message: string; status: string; ticket_id: number; ticket_id_b64: string }> {
    const { files, ...fields } = payload;

    // If there are attachments, send as multipart/form-data
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
      const { data } = await api.post('/tickets/compose', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }

    // No attachments — send as JSON
    const { data } = await api.post('/tickets/compose', fields);
    return data;
  },
};
