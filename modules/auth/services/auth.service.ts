import api from '@/lib/api';

export const authService = {
    async googleLogin(googleToken: string): Promise<any> {
        const { data } = await api.post('/auth/google', { token: googleToken });
        return data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async getProfile(): Promise<any> {
        const { data } = await api.get('/auth/me');
        return data;
    },
};
