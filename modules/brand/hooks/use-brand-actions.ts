import { useAddBrands, useUpdateBrand, useDeleteBrand } from './use-brands';
import { notification, modal, message } from '@/modules/theme';
import type { Brand } from '../types/brand';
import type { BrandModalController } from './use-brand-modal';

export const useBrandActions = (modalController: BrandModalController) => {
  const addMutation = useAddBrands();
  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();

  const saveBrand = async (items: { name: string; type: 'Focus' | 'Non Focus' }[]) => {
    if (items.length === 0) {
      message.warning('At least one brand is required!');
      return;
    }

    const hasEmpty = items.some((item) => !item.name.trim());
    if (hasEmpty) {
      message.warning('Brand name is required for all rows!');
      return;
    }

    if (modalController.mode === 'add') {
      await addMutation.mutateAsync(items);
      notification.success({
        message: 'Brands Added',
        description: `Successfully added ${items.length} brand(s) to the catalog.`,
        placement: 'topRight',
      });
    } else if (modalController.mode === 'edit' && modalController.selectedBrand) {
      await updateMutation.mutateAsync({
        id: modalController.selectedBrand.id,
        name: items[0].name.trim(),
        type: items[0].type,
      });
      notification.success({
        message: 'Brand Updated',
        description: `"${items[0].name.trim()}" has been successfully updated.`,
        placement: 'topRight',
      });
    }
    modalController.close();
  };

  const deleteBrand = (brand: Brand) => {
    modal.confirm({
      title: 'Confirm Brand Deletion',
      content: `Are you sure you want to permanently delete the brand "${brand.name}"? This action cannot be undone and will update the global catalog configuration.`,
      okText: 'Delete Brand',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        await deleteMutation.mutateAsync(brand.id);
        notification.success({
          message: 'Brand Deleted',
          description: `"${brand.name}" has been successfully deleted.`,
          placement: 'topRight',
        });
      },
    });
  };

  return {
    saveBrand,
    deleteBrand,
    loading: addMutation.isPending || updateMutation.isPending,
  };
};
