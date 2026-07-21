'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Clock,
  TrendingUp,
  Building2,
  PieChart,
  Tag,
  ShieldCheck,
  Download,
  Search,
  FileSpreadsheet,
  FileText,
  FileCode,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { AppButton, AppLabel, cn } from '@integrated-computer-system/ui-kit';
import { ProportNavbar } from '@/modules/sidebar';

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
}

const REPORT_TYPES: ReportType[] = [
  {
    id: 'ticket-summary',
    title: 'Ticket Summary',
    description: 'Overview of tickets by status, category, and priority.',
    icon: BarChart3,
    accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'sla-performance',
    title: 'SLA Performance',
    description: 'Track response rates and SLA turnaround resolution metrics.',
    icon: Clock,
    accent: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'sales-volume',
    title: 'Sales & Volume',
    description: 'Analyze total ticket values and target price match metrics.',
    icon: TrendingUp,
    accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'supplier-audit',
    title: 'Supplier Audit',
    description: 'Evaluate supplier response rate and turnaround times.',
    icon: Building2,
    accent: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'bu-group',
    title: 'BU Group Summary',
    description: 'Summary of ticket approvals and aging per business unit.',
    icon: PieChart,
    accent: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'brand-focus',
    title: 'Focus Brand Report',
    description: 'Focus vs Non-Focus brand volume and revenue split.',
    icon: Tag,
    accent: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
  {
    id: 'audit-trail',
    title: 'Audit Trail Report',
    description: 'User action logs, status updates, and assignment logs.',
    icon: ShieldCheck,
    accent: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 'custom-export',
    title: 'Custom Data Export',
    description: 'Generate filtered CSV or PDF reports with custom parameters.',
    icon: Download,
    accent: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
  },
];

interface DummyReport {
  id: string;
  name: string;
  category: string;
  author: string;
  date: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  size: string;
  status: string;
}

const DUMMY_REPORTS: DummyReport[] = [
  {
    id: 'REP-001',
    name: 'Q2 Focus Brand Sales Analysis',
    category: 'Brand & Revenue',
    author: 'Rico Mendoza',
    date: '2026-07-20',
    format: 'PDF',
    size: '2.4 MB',
    status: 'Ready',
  },
  {
    id: 'REP-002',
    name: 'Monthly BU Approval SLA Audit',
    category: 'SLA & Performance',
    author: 'ADEL System',
    date: '2026-07-19',
    format: 'XLSX',
    size: '1.8 MB',
    status: 'Ready',
  },
  {
    id: 'REP-003',
    name: 'Supplier Turnaround & Response Summary',
    category: 'Supplier Audit',
    author: 'Ana Santos',
    date: '2026-07-18',
    format: 'CSV',
    size: '840 KB',
    status: 'Ready',
  },
  {
    id: 'REP-004',
    name: 'Executive Target Match Audit',
    category: 'Sales & Volume',
    author: 'System Admin',
    date: '2026-07-15',
    format: 'PDF',
    size: '3.1 MB',
    status: 'Ready',
  },
  {
    id: 'REP-005',
    name: 'User Activity & Status History Logs',
    category: 'Audit Trail',
    author: 'Security System',
    date: '2026-07-10',
    format: 'CSV',
    size: '4.2 MB',
    status: 'Ready',
  },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredReports = DUMMY_REPORTS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'PDF':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <FileText size={12} /> PDF
          </span>
        );
      case 'XLSX':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <FileSpreadsheet size={12} /> XLSX
          </span>
        );
      case 'CSV':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FileCode size={12} /> CSV
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ProportNavbar title="Reports" />

      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <AppLabel as="h2" variant="title" className="!text-lg !font-bold">
              Reports & Analytics
            </AppLabel>
            <AppLabel as="p" variant="description" className="text-sm">
              Generate, schedule, and download analytical reports for tickets, SLAs, and performance metrics.
            </AppLabel>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REPORT_TYPES.map((report) => {
              const IconComp = report.icon;
              return (
                <div
                  key={report.id}
                  className="bg-card-bg border border-border/60 hover:border-accent-1/50 rounded-2xl p-4 transition-all duration-200 hover:shadow-md cursor-pointer group flex flex-col justify-between select-none"
                  onClick={() => {
                    // Modal trigger placeholder as requested
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', report.accent)}>
                        <IconComp size={22} />
                      </div>
                      <ArrowUpRight size={16} className="text-foreground/30 group-hover:text-accent-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-accent-1 transition-colors">
                      {report.title}
                    </h4>

                    <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
