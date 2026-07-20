import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsService } from '../services/tickets.service';

export const useTickets = (params?: {
  page?: number;
  per_page?: number;
  tab?: string;
  search?: string;
  sort_by?: string;
  status?: string;
  brand_type?: string;
}) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketsService.getTickets(params),
    refetchInterval: 10000,
  });
};

export const useTicketDetail = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsService.getTicketById(id),
    enabled: !!id,
    refetchInterval: 10000,
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { content: string; cc_ids?: string[]; status_action?: string } }) =>
      ticketsService.addReply(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assignee_ids }: { id: string; assignee_ids: string }) =>
      ticketsService.updateAssignment(id, assignee_ids),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['ticket-assignees', variables.id] });
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ticketsService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
    },
  });
};

export const useTicketHistory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['ticket-history', id],
    queryFn: () => ticketsService.getTicketHistory(id),
    enabled: !!id && enabled,
  });
};

export const useTicketAssignees = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['ticket-assignees', id],
    queryFn: () => ticketsService.getTicketAssignees(id),
    enabled: !!id && enabled,
  });
};

export const useCcUsers = (enabled = true) => {
  return useQuery({
    queryKey: ['cc-users'],
    queryFn: () => ticketsService.getCcUsers(),
    enabled,
  });
};
