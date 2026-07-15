'use client';

import React, { useState, useMemo } from 'react';
import {
  AppModal,
  AppAvatar,
  AppButton,
  AppInput,
  AppTable,
  AppSelect,
  AppFilterPopover
} from '@/components/ui';
import { Filter } from 'lucide-react';
import type { User } from '@/lib/types';

interface AppUserSelectModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  selectedUsers: User[];
  onSelect: (users: User[]) => void;
}

export function AppUserSelectModal({
  open,
  onClose,
  users,
  selectedUsers,
  onSelect,
}: AppUserSelectModalProps) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [tempDeptFilter, setTempDeptFilter] = useState('All');
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<User[]>([]);

  // Sync selected users when modal opens
  React.useEffect(() => {
    if (open) {
      setTempSelected(selectedUsers);
      setSearch('');
      setDeptFilter('All');
      setTempDeptFilter('All');
      setFilterPopoverOpen(false);
    }
  }, [open, selectedUsers]);

  // Sync temporary filter state when popover opens
  React.useEffect(() => {
    if (filterPopoverOpen) {
      setTempDeptFilter(deptFilter);
    }
  }, [filterPopoverOpen, deptFilter]);

  const availableDepts = useMemo(() => {
    const depts = new Set(users.map((u) => u.department || '').filter(Boolean));
    return ['All', ...Array.from(depts).sort()];
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department || '').toLowerCase().includes(q)
      );
      const matchesDept = deptFilter === 'All' || u.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [users, search, deptFilter]);

  const handleApply = () => {
    onSelect(tempSelected);
    onClose();
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: User) => {
        const avatarUrl = record.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${record.name.split(' ').map(n => n[0]).join('')}`;
        return (
          <div className="flex items-center gap-2.5 py-0">
            <AppAvatar
              src={avatarUrl}
              name={record.name}
              size={28}
              className="bg-accent-1 text-white font-bold shrink-0"
            />
            <span className="font-bold text-text text-sm">{record.name}</span>
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span className="text-xs text-text-info">{email}</span>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <span className="text-xs text-text-info">{dept || '—'}</span>,
    },
  ];

  return (
    <AppModal open={open} onClose={onClose} width={700} centered>
      <AppModal.Body className="space-y-4">
        {/* Header */}
        <div>
          <AppModal.Title>Select CC Recipients</AppModal.Title>
          <AppModal.Description>
            Choose users to copy on this price inquiry. Multiple select is supported.
          </AppModal.Description>
        </div>

        {/* Search Input and Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <AppInput
              preset="search"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, department..."
              className="w-full"
            />
          </div>

          {/* Filter Popover Component */}
          <AppFilterPopover
            open={filterPopoverOpen}
            onOpenChange={setFilterPopoverOpen}
            title="Filters"
            onResetAll={() => {
              setDeptFilter('All');
              setTempDeptFilter('All');
              setFilterPopoverOpen(false);
            }}
            onApply={() => {
              setDeptFilter(tempDeptFilter);
              setFilterPopoverOpen(false);
            }}
            onClose={() => setFilterPopoverOpen(false)}
            trigger={
              <AppButton
                variant="neutral"
                leftIcon={<Filter size={15} />}
                className="shrink-0"
              >
                <span>Filter</span>
                {deptFilter !== 'All' && (
                  <span className="flex items-center justify-center bg-accent-1 text-white text-[9px] font-bold h-4 w-4 rounded-full ml-1.5">
                    1
                  </span>
                )}
              </AppButton>
            }
          >
            <AppFilterPopover.Group
              title="Department"
              showReset={tempDeptFilter !== 'All'}
              onReset={() => setTempDeptFilter('All')}
            >
              <AppSelect
                options={availableDepts.map((d) => ({ value: d, label: d }))}
                value={tempDeptFilter}
                onChange={(val) => setTempDeptFilter(val)}
                placeholder="Select department"
                variant="borderless"
              />
            </AppFilterPopover.Group>
          </AppFilterPopover>
        </div>

        {/* Users Table */}
        <div className="max-h-[50vh] overflow-y-auto">
          <AppTable<User>
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            pagination={false}
            size="small"
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: tempSelected.map((u) => u.id),
              onChange: (_, selectedRows) => {
                setTempSelected(selectedRows);
              },
            }}
            onRow={(record) => ({
              onClick: (event) => {
                const target = event.target as HTMLElement;
                if (
                  target.closest('.ant-checkbox-wrapper') ||
                  target.closest('.ant-checkbox-input') ||
                  target.closest('.ant-checkbox')
                ) {
                  return;
                }

                setTempSelected((prev) => {
                  const exists = prev.some((u) => u.id === record.id);
                  if (exists) {
                    return prev.filter((u) => u.id !== record.id);
                  } else {
                    return [...prev, record];
                  }
                });
              },
            })}
            className="cursor-pointer"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <p className="text-xs text-text-info">
            Selected: <span className="font-bold text-text">{tempSelected.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <AppButton variant="neutral" onClick={onClose}>
              Cancel
            </AppButton>
            <AppButton variant="primary" onClick={handleApply}>
              Apply selection
            </AppButton>
          </div>
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
