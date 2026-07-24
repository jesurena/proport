import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '../services/brand.service';
import type { Brand } from '../types/brand';

export const useBrands = () => {
  return useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: brandService.getBrands,
    staleTime: 3 * 60 * 1000,
  });
};

export const useBuyers = () => {
  return useQuery({
    queryKey: ['buyers'],
    queryFn: brandService.getBuyers,
    staleTime: 10 * 60 * 1000,
  });
};

export const useAddBrands = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brandService.addBrands,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, type, defaultAssignee, assignees }: { id: string; name: string; type: 'Focus' | 'Non Focus'; defaultAssignee?: string; assignees?: string[] }) =>
      brandService.updateBrand(id, name, type, defaultAssignee, assignees),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};
