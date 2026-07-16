import axios from 'axios';
import { notification } from '@/components/Providers/theme-provider';
import { useAuthStore } from '@/modules/auth';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        const method = response.config.method?.toUpperCase();
        const hasMessage = response.data?.message;

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '') && hasMessage) {
            notification.success({
                title: 'Success',
                description: response.data.message,
                placement: 'topRight',
            });
        }
        return response;
    },
    async (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || '';
            const isLogoutRequest = requestUrl.includes('/auth/logout');
            const isGoogleAuthRequest = requestUrl.includes('/auth/google');

            if (isGoogleAuthRequest) {
                return Promise.reject(error);
            }

            if (!isLogoutRequest) {
                try {
                    // Call backend logout directly via raw axios to clear backend session/JWT
                    await axios.post('/api/auth/logout', {}, {
                        headers: {
                            Authorization: `Bearer ${useAuthStore.getState().token}`
                        }
                    });
                } catch (logoutError) {
                    console.error("Failed to call backend logout during auto-logout:", logoutError);
                }
            }

            // Clear Zustand auth store
            useAuthStore.getState().logout();

            if (typeof window !== 'undefined') {
                window.location.href = '/login?message=session_expired';
            }
        } else {
            notification.error({
                title: 'Error',
                description: message,
                placement: 'topRight',
            });
        }

        return Promise.reject(error);
    }
);

// Backward compatibility helper
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const { token } = useAuthStore.getState();
    const headers = new Headers(options.headers || {});

    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
    const cleanPath = path.startsWith('/api') ? path.substring(4) : path;
    const url = path.startsWith('http') ? path : `${baseURL}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export default api;
