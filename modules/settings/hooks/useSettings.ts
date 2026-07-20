import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';

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
    mutationFn: (isDefaultAssigned: boolean) =>
      settingsService.updateDefaultAssignment(isDefaultAssigned),
    onSuccess: () => {
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
    mutationFn: (metadata: any) => settingsService.updatePreferences(metadata),
    onSuccess: () => {
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
