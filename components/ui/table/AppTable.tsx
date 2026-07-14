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

  className?: string;
}

export function AppTable<RecordType extends object>({
  columns,
  dataSource,
  className,
  pagination,
  ...props
}: AppTableProps<RecordType>) {
  const resolvedColumns = React.useMemo(() => columns, [columns]);

  const resolvedPagination = pagination;

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
