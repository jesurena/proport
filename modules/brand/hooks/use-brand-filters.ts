import { useState, useMemo } from 'react';
import type { Brand } from '../types/brand';

export const useBrandFilters = (brands: Brand[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandTypes, setSelectedBrandTypes] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredBrands = useMemo(() => {
    let result = brands;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.type.toLowerCase().includes(q)
      );
    }

    if (selectedBrandTypes.length > 0) {
      result = result.filter((b) => selectedBrandTypes.includes(b.type));
    }

    return result;
  }, [brands, searchQuery, selectedBrandTypes]);

  return {
    filteredBrands,
    searchQuery,
    setSearchQuery,
    selectedBrandTypes,
    setSelectedBrandTypes,
    filterOpen,
    setFilterOpen,
    activeFiltersCount: selectedBrandTypes.length,
  };
};

export type BrandFiltersType = ReturnType<typeof useBrandFilters>;
