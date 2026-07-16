import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, useAuthStore } from '@/modules/auth';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { setToken, setUser, logout: storeLogout } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: async (googleToken: string) => {
            return authService.googleLogin(googleToken);
        },
        onSuccess: (data) => {
            setToken(data.token);
            setUser(data.user);
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
        onError: (error) => {
            console.error('Failed to authenticate Google token:', error);
            storeLogout();
            queryClient.clear();
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await authService.logout();
        },
        onSuccess: () => {
            storeLogout();
            queryClient.clear();
            if (typeof window !== 'undefined') {
                window.location.replace('/login');
            }
        },
        onError: (error) => {
            console.error('Backend logout failed, clearing client session anyway:', error);
            storeLogout();
            queryClient.clear();
            if (typeof window !== 'undefined') {
                window.location.replace('/login');
            }
        },
    });

    return {
        login: async (token: string) => {
            return loginMutation.mutateAsync(token);
        },
        logout: async () => {
            return logoutMutation.mutateAsync();
        },
        isLoginPending: loginMutation.isPending,
        isLoginError: loginMutation.isError,
        loginError: loginMutation.error,
        isLogoutPending: logoutMutation.isPending,
    };
};

export const useFetchProfile = () => {
    const { setUser, token } = useAuthStore();
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            if (!token) return null;
            const data = await authService.getProfile();
            setUser(data);
            return data;
        },
        enabled: !!token,
    });
};
