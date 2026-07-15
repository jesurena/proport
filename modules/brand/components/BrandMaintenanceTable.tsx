import React from 'react';
import { Edit, Trash2, MoreVertical, Award, Box } from 'lucide-react';
import { AppChip } from '@integrated-computer-system/ui-kit';
import { AppDropdown, AppTable } from '@/components/ui';
import type { Brand } from '@/lib/brands';

interface BrandMaintenanceTableProps {
  filteredBrands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export default function BrandMaintenanceTable({
  filteredBrands,
  onEdit,
  onDelete,
}: BrandMaintenanceTableProps) {
  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left' as const,
    },
    {
      title: 'Brand Type',
      dataIndex: 'type',
      key: 'type',
      align: 'center' as const,
      render: (type: string) => (
        <AppChip
          label={type}
          color={type === 'Focus' ? '#7c3aed' : '#2563eb'}
          icon={type === 'Focus' ? <Award /> : <Box />}
          size="sm"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as const,
      width: 120,
      render: (_: any, record: Brand) => {
        const dropdownItems = [
          { key: 'edit', label: 'Edit', icon: <Edit size={14} className="text-emerald-600" /> },
          { key: 'delete', label: 'Delete', icon: <Trash2 size={14} className="text-rose-600" /> },
        ];
        const handleMenuClick = (info: any) => {
          if (info.key === 'edit') {
            onEdit(record);
          } else if (info.key === 'delete') {
            onDelete(record);
          }
        };
        return (
          <div className="flex items-center justify-center">
            <AppDropdown items={dropdownItems} onItemClick={handleMenuClick} placement="bottomRight">
              <button className="p-2 rounded-lg text-text-info transition-all cursor-pointer">
                <MoreVertical size={16} />
              </button>
            </AppDropdown>
          </div>
        );
      },
    },
  ];

  return (
    <AppTable
      columns={columns}
      dataSource={filteredBrands}

      rowKey="id"
    />
  );
}
