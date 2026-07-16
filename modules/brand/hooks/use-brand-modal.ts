import { useState } from 'react';
import type { Brand } from '../types/brand';

export const useBrandModal = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandType, setBrandType] = useState<'Focus' | 'Non Focus'>('Focus');

  const openAdd = () => {
    setSelectedBrand(null);
    setBrandName('');
    setBrandType('Focus');
    setMode('add');
    setOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setBrandName(brand.name);
    setBrandType(brand.type);
    setMode('edit');
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return {
    open,
    mode,
    selectedBrand,
    brandName,
    setBrandName,
    brandType,
    setBrandType,
    openAdd,
    openEdit,
    close,
  };
};

export type BrandModalController = ReturnType<typeof useBrandModal>;
