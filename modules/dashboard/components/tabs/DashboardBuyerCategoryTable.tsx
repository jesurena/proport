'use client';

import React, { useState, useMemo } from 'react';
import { AppTable, AppLabel, AppAvatar } from '@/components/ui';
import { useBuyerCategoryCounts } from '../../hooks/useDashboard';

export default function DashboardBuyerCategoryTable() {
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    sort_field: 'AccountName',
    sort_order: 'asc' as 'asc' | 'desc',
  });

  const { data, isLoading } = useBuyerCategoryCounts(params, true);

  const tableData = useMemo(() => {
    const list = data?.data || [];
    return list.map((item: any, index: number) => ({
      id: String(index),
      buyer: item.AccountName,
      avatar: item.GAvatar,
      focusPending: Number(item.focus_pending_count || 0),
      focusAnswered: Number(item.focus_answered_count || 0),
      focusClosed: Number(item.focus_closed_count || 0),
      nonFocusPending: Number(item.nf_pending_count || 0),
      nonFocusAnswered: Number(item.nf_answered_count || 0),
      nonFocusClosed: Number(item.nf_closed_count || 0),
    }));
  }, [data]);

  const columns = [
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      fixed: 'left' as const,
      sorter: true,
      render: (text: string, record: any) => (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <AppAvatar src={record.avatar} name={text} size={26} />
          <AppLabel variant="body" className="font-semibold">{text}</AppLabel>
        </div>
      ),
    },
    {
      title: 'Focus - Pending',
      dataIndex: 'focusPending',
      key: 'focusPending',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Focus - Answered',
      dataIndex: 'focusAnswered',
      key: 'focusAnswered',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Focus - Closed',
      dataIndex: 'focusClosed',
      key: 'focusClosed',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Pending',
      dataIndex: 'nonFocusPending',
      key: 'nonFocusPending',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Answered',
      dataIndex: 'nonFocusAnswered',
      key: 'nonFocusAnswered',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Closed',
      dataIndex: 'nonFocusClosed',
      key: 'nonFocusClosed',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
  ];

  return (
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
          const sortField = sorter.field || 'AccountName';
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
  );
}
