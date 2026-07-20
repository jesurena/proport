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
