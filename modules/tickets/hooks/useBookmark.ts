import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkService } from '../services/bookmark.service';

export const useBookmarks = (enabled = true) => {
  return useQuery({
    queryKey: ['user-bookmarks'],
    queryFn: () => bookmarkService.getBookmarks(),
    enabled,
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000,
  });
};

export const useAddBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number) => bookmarkService.addBookmark(ticketId),
    onMutate: async (ticketId: number) => {
      await queryClient.cancelQueries({ queryKey: ['user-bookmarks'] });
      const previousBookmarks = queryClient.getQueryData<any[]>(['user-bookmarks']) || [];

      queryClient.setQueryData(['user-bookmarks'], (old: any[] = []) => {
        const numericId = Number(ticketId);
        const exists = old.some((b: any) => Number(b.ticket_id ?? b) === numericId);
        if (exists) return old;
        return [...old, { ticket_id: numericId }];
      });

      return { previousBookmarks };
    },
    onError: (_err, _ticketId, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(['user-bookmarks'], context.previousBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarked-tickets'] });
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number) => bookmarkService.removeBookmark(ticketId),
    onMutate: async (ticketId: number) => {
      await queryClient.cancelQueries({ queryKey: ['user-bookmarks'] });
      const previousBookmarks = queryClient.getQueryData<any[]>(['user-bookmarks']) || [];

      queryClient.setQueryData(['user-bookmarks'], (old: any[] = []) => {
        const numericId = Number(ticketId);
        return old.filter((b: any) => Number(b.ticket_id ?? b) !== numericId);
      });

      return { previousBookmarks };
    },
    onError: (_err, _ticketId, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(['user-bookmarks'], context.previousBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarked-tickets'] });
    },
  });
};
