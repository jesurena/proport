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

export const useBuHeadAging = () => {
  return useQuery({
    queryKey: ['dashboard-bu-head-aging'],
    queryFn: async () => {
      return buHeadService.getAging();
    },
  });
};

export const useBuHeadGroupCreations = () => {
  return useQuery({
    queryKey: ['dashboard-bu-head-group-creations'],
    queryFn: async () => {
      return buHeadService.getGroupCreations();
    },
  });
};
