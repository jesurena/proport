import api from '@/lib/api';
import type { Brand } from '../types/brand';

export interface BackendBrand {
    brand_id: number;
    brand: string;
    transaction_type_id: number;
    is_deleted: number;
    transaction_description: string;
}

export const brandService = {
    async getBrands(): Promise<Brand[]> {
        const { data } = await api.get<BackendBrand[]>('/brand-settings');
        const assigneeGroups = [
            'Jesureña',
            'ESD-Buyer1, ESD-Buyer2',
            'ESD-Buyer2',
            'Sales / Requestor, Admin',
            'Admin, Jesureña'
        ];
        return data.map((b) => ({
            id: String(b.brand_id),
            name: b.brand,
            type: b.transaction_description === 'Focus' ? 'Focus' : 'Non Focus',
            defaultAssignee: assigneeGroups[b.brand_id % assigneeGroups.length],
        }));
    },

    async addBrands(items: { name: string; type: 'Focus' | 'Non Focus'; defaultAssignee?: string }[]): Promise<any> {
        const brandNames = items.map(item => item.name);
        const brandTypeIDs = items.map(item => item.type === 'Focus' ? 1 : 2);
        
        const { data } = await api.post('/add-brand', {
            brandName: brandNames,
            brandTypeID: brandTypeIDs
        });
        return data;
    },

    async updateBrand(id: string | number, name: string, type: 'Focus' | 'Non Focus', defaultAssignee?: string): Promise<any> {
        const typeID = type === 'Focus' ? 1 : 2;
        const { data } = await api.post('/edit-brand', {
            editBrandID: id,
            editBrandName: name.toUpperCase(),
            editBrandTypeID: typeID
        });
        return data;
    },

    async deleteBrand(id: string | number): Promise<any> {
        const { data } = await api.get(`/delete-brand?bid=${id}`);
        return data;
    },
};
