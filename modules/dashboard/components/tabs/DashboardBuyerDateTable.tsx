'use client';

import React, { useState, useMemo } from 'react';
import { AppTable, AppLabel, AppAvatar } from '@/components/ui';
import { useBuyerDateCounts } from '../../hooks/useDashboard';
import { DashboardTabTableSkeleton } from '@/components/skeleton';

export default function DashboardBuyerDateTable() {
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    sort_field: 'date_created',
    sort_order: 'desc' as 'asc' | 'desc',
  });

  const { data, isLoading } = useBuyerDateCounts(params, true);

  const columns = useMemo(() => {
    const list = data?.data || [];
    if (list.length === 0) return [];
    const firstRowKeys = Object.keys(list[0]).filter((k) => k !== 'GAvatar');
    return firstRowKeys.map((key) => {
      const isName = key.toLowerCase() === 'accountname' || key.toLowerCase() === 'name' || key.toLowerCase() === 'buyer';
      return {
        title: key,
        dataIndex: key,
        key: key,
        align: isName ? ('left' as const) : ('center' as const),
        sorter: true,
        render: (val: any, record: any) => {
          if (isName) {
            return (
              <div className="flex items-center gap-2">
                <AppAvatar src={record.GAvatar} name={val} size={24} />
                <AppLabel variant="body">{val}</AppLabel>
              </div>
            );
          }
          return <AppLabel className="text-text-info text-xs">{val ?? 0}</AppLabel>;
        },
      };
    });
  }, [data]);

  const tableData = useMemo(() => {
    const list = data?.data || [];
    return list.map((item: any, index: number) => ({
      id: String(index),
      ...item,
    }));
  }, [data]);

  return (
    isLoading ? (
      <DashboardTabTableSkeleton />
    ) : (
      <div className="space-y-3 animate-in fade-in duration-200 w-full">
        <AppTable
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={{
            current: params.page,
            pageSize: params.per_page,
            total: data?.total || 0,
          }}
          onChange={(pagination, filters, sorter: any) => {
            const sortField = sorter.field || 'date_created';
            const sortOrder = sorter.order === 'descend' ? 'desc' : 'asc';
            setParams((prev) => ({
              ...prev,
              page: pagination.current || 1,
              per_page: pagination.pageSize || 10,
              sort_field: sortField,
              sort_order: sortOrder,
            }));
          }}
          loading={isLoading}
          scroll={{ x: 'max-content' }}
        />
      </div>
    )
  );
}
