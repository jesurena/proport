import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';

function createDebouncedFn<T, R>(fn: (arg: T) => Promise<R>, delay: number = 1000) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let latestResolve: ((value: R | PromiseLike<R>) => void) | null = null;
  let latestReject: ((reason?: any) => void) | null = null;

  return (arg: T): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      latestResolve = resolve;
      latestReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(arg);
          if (latestResolve) latestResolve(result);
        } catch (error) {
          if (latestReject) latestReject(error);
        } finally {
          timeoutId = null;
          latestResolve = null;
          latestReject = null;
        }
      }, delay);
    });
  };
}

const debouncedUpdateDefaultAssignment = createDebouncedFn(
  (isDefaultAssigned: boolean) => settingsService.updateDefaultAssignment(isDefaultAssigned),
  1000
);

const debouncedUpdatePreferences = createDebouncedFn(
  (metadata: any) => settingsService.updatePreferences(metadata),
  1000
);

export const useDefaultAssignment = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['default-assignment'],
    queryFn: () => settingsService.getDefaultAssignment(),
    enabled,
  });
};

export const useUpdateDefaultAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    onMutate: async (newVal: boolean) => {
      await queryClient.cancelQueries({ queryKey: ['default-assignment'] });
      const previousValue = queryClient.getQueryData(['default-assignment']);
      queryClient.setQueryData(['default-assignment'], newVal);
      return { previousValue };
    },
    mutationFn: (isDefaultAssigned: boolean) =>
      debouncedUpdateDefaultAssignment(isDefaultAssigned),
    onError: (err, newVal, context) => {
      if (context?.previousValue !== undefined) {
        queryClient.setQueryData(['default-assignment'], context.previousValue);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['default-assignment'] });
    },
  });
};

export const usePreferences = (enabled = true) => {
  return useQuery({
    queryKey: ['user-preferences'],
    queryFn: () => settingsService.getPreferences(),
    enabled,
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    onMutate: async (newMetadata: any) => {
      await queryClient.cancelQueries({ queryKey: ['user-preferences'] });
      const previousData: any = queryClient.getQueryData(['user-preferences']);

      queryClient.setQueryData(['user-preferences'], (old: any) => ({
        ...old,
        metadata: {
          ...(old?.metadata || {}),
          ...newMetadata,
        },
      }));

      return { previousData };
    },
    mutationFn: (metadata: any) => debouncedUpdatePreferences(metadata),
    onError: (err, newMetadata, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['user-preferences'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });
};

export const useBookmarks = (enabled = true) => {
  return useQuery({
    queryKey: ['user-bookmarks'],
    queryFn: () => settingsService.getBookmarks(),
    enabled,
  });
};

export const useAddBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number) => settingsService.addBookmark(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookmarks'] });
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number) => settingsService.removeBookmark(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookmarks'] });
    },
  });
};
