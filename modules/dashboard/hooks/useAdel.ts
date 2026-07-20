import { useQuery } from '@tanstack/react-query';
import { adelService } from '../services/adel.service';

export const useAdelCounts = () => {
  return useQuery({
    queryKey: ['dashboard-adel-counts'],
    queryFn: async () => {
      return adelService.getCounts();
    },
  });
};
