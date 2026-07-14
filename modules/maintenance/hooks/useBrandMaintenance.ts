import { useState, useEffect, useMemo } from 'react';
import { getBrands, addBrand, updateBrand, deleteBrand, type Brand } from '@/lib/brands';
import { notification, modal, message } from '@/modules/theme';

export function useBrandMaintenance() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Form states
  const [brandName, setBrandName] = useState('');
  const [brandType, setBrandType] = useState<'Focus' | 'Non Focus'>('Focus');

  // Load brands
  const loadBrands = () => {
    setBrands(getBrands());
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Filtered brands
  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q)
    );
  }, [brands, searchQuery]);

  // Open modal for add
  const handleOpenAdd = () => {
    setSelectedBrand(null);
    setBrandName('');
    setBrandType('Focus');
    setModalMode('add');
    setModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setBrandName(brand.name);
    setBrandType(brand.type);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Save changes (covers both add and edit)
  const handleSave = () => {
    if (!brandName.trim()) {
      message.warning('Brand name is required!');
      return;
    }

    if (modalMode === 'add') {
      addBrand(brandName.trim(), brandType);
      notification.success({
        message: 'Brand Added',
        description: `"${brandName.trim()}" has been successfully added to the catalog.`,
        placement: 'topRight',
      });
    } else if (modalMode === 'edit' && selectedBrand) {
      updateBrand(selectedBrand.id, brandName.trim(), brandType);
      notification.success({
        message: 'Brand Updated',
        description: `"${brandName.trim()}" has been successfully updated.`,
        placement: 'topRight',
      });
    }

    setModalOpen(false);
    loadBrands();
  };

  // Delete Brand: open using modal.confirm
  const handleOpenDelete = (brand: Brand) => {
    modal.confirm({
      title: 'Confirm Brand Deletion',
      content: `Are you sure you want to permanently delete the brand "${brand.name}"? This action cannot be undone and will update the global catalog configuration.`,
      okText: 'Delete Brand',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      centered: true,
      onOk: () => {
        deleteBrand(brand.id);
        loadBrands();
        notification.success({
          message: 'Brand Deleted',
          description: `"${brand.name}" has been successfully deleted.`,
          placement: 'topRight',
        });
      },
    });
  };

  return {
    brands,
    searchQuery,
    setSearchQuery,
    modalOpen,
    setModalOpen,
    modalMode,
    brandName,
    setBrandName,
    brandType,
    setBrandType,
    filteredBrands,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleOpenDelete,
  };
}
