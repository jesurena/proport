import { useQuery } from '@tanstack/react-query';
import { buHeadService } from '../services/bu-head.service';

export const useBuHeadCounts = () => {
  return useQuery({
    queryKey: ['dashboard-bu-head-counts'],
    queryFn: async () => {
      return buHeadService.getCounts();
    },
  });
};
