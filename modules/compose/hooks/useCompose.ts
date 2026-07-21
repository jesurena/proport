import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { composeService } from '../services/compose.service';

export const useComposeInitData = (enabled = true) => {
  return useQuery({
    queryKey: ['compose-init-data'],
    queryFn: () => composeService.getComposeInitData(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30m cache for static init data
  });
};

export const useComposeBrands = (tid: number, enabled = true) => {
  return useQuery({
    queryKey: ['compose-brands', tid],
    queryFn: () => composeService.getBrandsByTType(tid),
    enabled: enabled && !!tid,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      subject: string;
      requestContent: string;
      customerID: string;
      customerName: string;
      projectName: string;
      tTypeID: number;
      aoID: string;
      requestTypeID: number;
      brandID: number[];
      ccID?: string[];
      files?: File[];
    }) => composeService.createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
