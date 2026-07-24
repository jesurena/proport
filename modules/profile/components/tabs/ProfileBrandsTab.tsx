'use client';

import React, { useState } from 'react';
import { Search, Tag, Award, Box } from 'lucide-react';
import { AppChip } from '@integrated-computer-system/ui-kit';
import { AppInput, AppLabel } from '@/components/ui';
import { UserProfileBrandsSkeleton } from '@/components/skeleton';
import { useUserBrands } from '../../hooks/useProfile';

interface ProfileBrandsTabProps {
  userId: string | number;
}

export function ProfileBrandsTab({ userId }: ProfileBrandsTabProps) {
  const [search, setSearch] = useState('');
  const { data: brands = [], isLoading } = useUserBrands(String(userId));

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <UserProfileBrandsSkeleton count={6} />;
  }

  return (
    <div className="space-y-3.5 p-1">
      {/* Search and Header bar */}
      <div className="flex items-center justify-between gap-3">
        <AppInput
          placeholder="Search assigned brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          rightIcon={<Search size={14} className="text-text-info/50" />}
          className="!h-9 text-xs flex-1"
        />
      </div>

      {/* Brands List / Grid */}
      {filteredBrands.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center text-text-info/60 border border-dashed border-border/60 rounded-xl">
          <Tag size={28} className="mb-2 opacity-40" />
          <AppLabel as="p" className="text-xs font-medium">
            {search ? 'No brands matching search criteria' : 'No assigned brands found for this buyer'}
          </AppLabel>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 max-h-[48vh] overflow-y-auto pr-1">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="p-3 rounded-xl bg-card-bg border border-border/40 hover:border-border transition-all flex items-center justify-between gap-2 shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-neutral/20 flex items-center justify-center shrink-0">
                  <Tag size={16} className="text-text-info" />
                </div>
                <div className="min-w-0">
                  <AppLabel as="p" className="text-xs font-bold text-foreground truncate leading-tight">
                    {brand.name}
                  </AppLabel>
                </div>
              </div>

              <AppChip
                label={brand.type || 'Focus'}
                color={brand.type === 'Focus' ? '#7c3aed' : '#2563eb'}
                icon={brand.type === 'Focus' ? <Award size={12} /> : <Box size={12} />}
                size="sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
