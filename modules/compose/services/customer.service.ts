import { getCustomers, type Customer } from '@/lib/customers';

export const customerService = {
  async searchCustomers(keyword: string): Promise<Customer[]> {
    const trimmed = keyword.trim();
    if (!trimmed || trimmed.length < 2) return [];

    try {
      let encoded = '';
      if (typeof window !== 'undefined') {
        try {
          encoded = btoa(unescape(encodeURIComponent(trimmed)));
        } catch {
          encoded = btoa(trimmed);
        }
      } else {
        encoded = Buffer.from(trimmed).toString('base64');
      }

      const res = await fetch(`https://ice-cream.ics.com.ph/api/liveSearch?key=${encoded}`);
      if (!res.ok) return [];

      const json = await res.json();
      return this.parseSearchResponse(json);
    } catch (err) {
      console.error('Failed to search customers:', err);
      return [];
    }
  },

  parseSearchResponse(json: any): Customer[] {
    if (!json) return [];

    let rawData: any[] = [];
    if (Array.isArray(json)) {
      rawData = json;
    } else if (typeof json === 'object') {
      if (Array.isArray(json.data)) {
        rawData = json.data;
      } else if (json.data && typeof json.data === 'object') {
        rawData = Object.values(json.data);
      } else {
        rawData = Object.values(json);
      }
    }

    return rawData.map((item: any) => {
      const rawId = item.CustomerID || item.CustomerNumber || item.id || '';
      const id = rawId && String(rawId) !== 'null' ? String(rawId) : '—';
      const name = item.CustomerName || item.name || '';

      let salesArea = 'Prospective Customer';
      if (item.SalesGroup && item.DistributionChannel) {
        salesArea = `${item.SalesGroup} ${item.DistributionChannel}`;
      } else if (item.CustomerType && String(item.CustomerType) !== 'null') {
        salesArea = String(item.CustomerType);
      } else if (item.SourceDB && String(item.SourceDB) !== 'null') {
        salesArea = item.SourceDB === 'Prospect' ? 'Prospective Customer' : String(item.SourceDB);
      }

      let buAo = '';
      if (item.BU || item.AO) {
        const bu = item.BU || '';
        const ao = item.AO || '';
        buAo = bu && ao ? `${bu} - ${ao}` : bu || ao;
      } else if (item.buAo) {
        buAo = item.buAo;
      }

      return {
        id,
        name,
        salesArea,
        buAo,
      };
    });
  },
};
