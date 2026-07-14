'use client';

import React from 'react';
import { Table, ConfigProvider } from 'antd';
import type { TableProps } from 'antd';
import { cn } from '../../utils/cn';

export interface AppTableColumnType<RecordType> {
  title: React.ReactNode;
  dataIndex?: string | string[];
  key?: string;
  slotName?: string;
  render?: (value: any, record: RecordType, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export interface AppTableProps<RecordType> extends Omit<TableProps<RecordType>, 'columns'> {
  columns: AppTableColumnType<RecordType>[];
  dataSource: RecordType[];
  slots?: Record<string, (value: any, record: RecordType, index: number) => React.ReactNode>;
  className?: string;
}

export function AppTable<RecordType extends object>({
  columns,
  dataSource,
  slots,
  className,
  pagination,
  ...props
}: AppTableProps<RecordType>) {
  const resolvedColumns = React.useMemo(() => {
    return columns.map((col) => {
      const renderFn = col.render || (col.slotName && slots?.[col.slotName]
        ? (value: any, record: RecordType, index: number) => slots[col.slotName!](value, record, index)
        : undefined);

      return {
        ...col,
        render: renderFn,
      };
    });
  }, [columns, slots]);

  const resolvedPagination = React.useMemo(() => {
    if (pagination === false) return false;
    return {
      defaultPageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '20', '50'],
      showTotal: (total: number, range: [number, number]) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
      ...pagination,
    };
  }, [pagination]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: 'var(--neutral)',
            headerColor: 'var(--text-info)',
            rowHoverBg: 'transparent',
          },
        },
      }}
    >
      <div className={cn("app-table-wrapper border border-border/60 rounded-2xl overflow-hidden bg-card-bg shadow-sm", className)}>
        <Table
          dataSource={dataSource}
          columns={resolvedColumns as any}
          pagination={resolvedPagination as any}
          className="app-table"
          {...props}
        />
      </div>
    </ConfigProvider>
  );
}
