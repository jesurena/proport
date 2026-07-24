import api from '@/lib/api';

export const settingsService = {
  async getDefaultAssignment(): Promise<boolean> {
    const { data } = await api.get('/user/default-assignment');
    return data.is_default_assigned;
  },

  async updateDefaultAssignment(isDefaultAssigned: boolean): Promise<boolean> {
    const { data } = await api.post('/user/default-assignment', {
      is_default_assigned: isDefaultAssigned,
    });
    return data.is_default_assigned;
  },

  async getPreferences(): Promise<any> {
    const { data } = await api.get('/settings/preferences');
    return data;
  },

  async updatePreferences(metadata: any): Promise<any> {
    const { data } = await api.post('/settings/preferences', { metadata });
    return data;
  },
};
