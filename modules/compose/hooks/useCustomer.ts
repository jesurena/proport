import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '@/lib/customers';
import { customerService } from '../services/customer.service';

function useDebounce<T>(value: T, delay = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export const useCustomer = (search: string, enabled = true) => {
  const debouncedSearch = useDebounce(search.trim(), 350);
  const hasSearched = debouncedSearch.length >= 2;

  const { data: liveCustomers = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['customer-live-search', debouncedSearch],
    queryFn: () => customerService.searchCustomers(debouncedSearch),
    enabled: enabled && hasSearched,
    staleTime: 1000 * 60 * 5,
  });

  const customers = liveCustomers.length > 0 ? liveCustomers : getCustomers();

  return {
    customers,
    isLoading: isLoading || (hasSearched && isFetching),
    hasSearched: search.trim().length >= 2,
    refetch,
  };
};
