import api from '@/lib/api';
import type { Brand } from '../types/brand';

export interface BackendBrand {
    brand_id: number;
    brand: string;
    transaction_type_id: number;
    is_deleted: number;
    transaction_description: string;
    assignees?: { id: string; name: string; email: string; avatar?: string | null }[];
}

export const brandService = {
    async getBrands(): Promise<Brand[]> {
        const { data } = await api.get<BackendBrand[]>('/brand-settings');
        return data.map((b) => {
            const assignees = b.assignees || [];
            const assigneeNames = assignees.map((a) => a.name).join(', ');
            return {
                id: String(b.brand_id),
                name: b.brand,
                type: b.transaction_description === 'Focus' ? 'Focus' : 'Non Focus',
                defaultAssignee: assigneeNames || undefined,
                assignees: assignees,
            };
        });
    },

    async addBrands(items: { name: string; type: 'Focus' | 'Non Focus'; defaultAssignee?: string; assignees?: string[] }[]): Promise<any> {
        const brandNames = items.map(item => item.name);
        const brandTypeIDs = items.map(item => item.type === 'Focus' ? 1 : 2);
        const assignees = items[0]?.assignees || [];

        const { data } = await api.post('/add-brand', {
            brandName: brandNames,
            brandTypeID: brandTypeIDs,
            assignees: assignees
        });
        return data;
    },

    async updateBrand(id: string | number, name: string, type: 'Focus' | 'Non Focus', defaultAssignee?: string, assignees?: string[]): Promise<any> {
        const typeID = type === 'Focus' ? 1 : 2;
        const { data } = await api.post('/edit-brand', {
            editBrandID: id,
            editBrandName: name.toUpperCase(),
            editBrandTypeID: typeID,
            assignees: assignees || []
        });
        return data;
    },

    async deleteBrand(id: string | number): Promise<any> {
        const { data } = await api.get(`/delete-brand?bid=${id}`);
        return data;
    },

    async getBuyers(): Promise<import('@/lib/types').User[]> {
        const { data } = await api.get<any[]>('/buyers');
        return data.map((b) => ({
            id: String(b.id),
            name: b.name,
            email: b.email,
            avatar: b.avatar || undefined,
            role: 'buyer' as const,
        }));
    },
};
