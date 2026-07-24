import React from 'react';
import { Edit, Trash2, MoreVertical, Award, Box } from 'lucide-react';
import { Tooltip } from 'antd';
import { AppChip } from '@integrated-computer-system/ui-kit';
import { AppAvatar, AppDropdown, AppTable } from '@/components/ui';
import type { Brand } from '../types/brand';

interface BrandTableProps {
  filteredBrands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export default function BrandTable({
  filteredBrands,
  onEdit,
  onDelete,
}: BrandTableProps) {
  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left' as const,
      sorter: (a: Brand, b: Brand) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend' as const,
    },
    {
      title: 'Brand Type',
      dataIndex: 'type',
      key: 'type',
      align: 'center' as const,
      sorter: (a: Brand, b: Brand) => a.type.localeCompare(b.type),
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
      title: 'Default Assignee',
      dataIndex: 'defaultAssignee',
      key: 'defaultAssignee',
      align: 'center' as const,
      render: (_: any, record: Brand) => {
        const assignees = record.assignees || [];
        if (assignees.length > 0) {
          return (
            <div className="flex items-center justify-center -space-x-1.5 overflow-hidden">
              {assignees.map((assignee) => (
                <Tooltip key={assignee.id} title={assignee.name} placement="top" mouseEnterDelay={0.1}>
                  <div className="inline-block rounded-full cursor-pointer hover:z-10 transition-transform">
                    <AppAvatar src={assignee.avatar || undefined} name={assignee.name} size={28} />
                  </div>
                </Tooltip>
              ))}
            </div>
          );
        }

        if (record.defaultAssignee) {
          const names = record.defaultAssignee.split(',').map((n) => n.trim()).filter(Boolean);
          if (names.length > 0) {
            return (
              <div className="flex items-center justify-center -space-x-1.5 overflow-hidden">
                {names.map((name, idx) => (
                  <Tooltip key={idx} title={name} placement="top" mouseEnterDelay={0.1}>
                    <div className="inline-block ring-2 ring-card-bg rounded-full cursor-pointer hover:z-10 transition-transform hover:scale-110">
                      <AppAvatar name={name} size={28} />
                    </div>
                  </Tooltip>
                ))}
              </div>
            );
          }
        }

        return (
          <span className="text-xs text-text-info/60 font-medium italic">
            No assignee yet
          </span>
        );
      },
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
