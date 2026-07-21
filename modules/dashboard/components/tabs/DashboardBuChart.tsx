'use client';

import React, { useState, useMemo } from 'react';
import { AppCard, AppLabel } from '@/components/ui';
import { useChartPerBu } from '../../hooks/useDashboard';

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green/teal
  '#eedcd2', // peach
  '#c05c46', // sienna/brown
  '#5d4b8a', // purple
  '#ff7a5a', // coral
  '#8c1d35', // dark red
  '#f3e1d3', // light peach
  '#34495e', // slate
  '#f1c40f', // yellow
  '#e67e22', // orange
  '#2ecc71', // bright green
  '#9b59b6', // violet
  '#1abc9c', // turquoise
];

export default function DashboardBuChart() {
  const [selectedBU, setSelectedBU] = useState<string | null>(null);
  const { data: chartPerBuData } = useChartPerBu(true);

  const buSlices = useMemo(() => {
    if (!chartPerBuData) return [];

    const sorted = [...chartPerBuData].sort((a: any, b: any) => Number(b.cnt || 0) - Number(a.cnt || 0));
    const total = sorted.reduce((sum: number, item: any) => sum + Number(item.cnt || 0), 0) || 1;

    let cumulativePercent = 0;

    return sorted.map((item: any, index: number) => {
      const name = item.AccountGroup || 'General';
      const count = Number(item.cnt || 0);
      const percent = count / total;
      const sliceStart = cumulativePercent;
      const startX = Math.cos(2 * Math.PI * cumulativePercent) * 46 + 50;
      const startY = Math.sin(2 * Math.PI * cumulativePercent) * 46 + 50;
      cumulativePercent += percent;
      const endX = Math.cos(2 * Math.PI * cumulativePercent) * 46 + 50;
      const endY = Math.sin(2 * Math.PI * cumulativePercent) * 46 + 50;
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const pathData = percent === 1
        ? `M 50 4 A 46 46 0 1 1 49.999 4 Z`
        : `M 50 50 L ${startX} ${startY} A 46 46 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

      const color = COLORS[index % COLORS.length];

      const middlePercent = sliceStart + (percent / 2);
      const labelX = Math.cos(2 * Math.PI * middlePercent) * 28 + 50;
      const labelY = Math.sin(2 * Math.PI * middlePercent) * 28 + 50;

      return {
        name,
        count,
        percent,
        pathData,
        color,
        labelX,
        labelY,
      };
    });
  }, [chartPerBuData]);

  const handleSelectBU = (buName: string) => {
    setSelectedBU((prev) => (prev === buName ? null : buName));
  };

  return (
    <AppCard variant="default" padding="lg" className="py-6 space-y-5 animate-in fade-in duration-200">
      <AppLabel as="h4" className="text-sm font-bold text-text mb-2 text-center">Tickets per BU</AppLabel>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-4">
        {/* SVG Pie Chart Widget */}
        <div className="relative w-80 h-80 shrink-0">
          <svg className="w-80 h-80 -rotate-90" viewBox="0 0 100 100">
            {buSlices.map((slice) => {
              const isSelected = selectedBU === slice.name;
              return (
                <g key={slice.name}>
                  <path
                    d={slice.pathData}
                    fill={slice.color}
                    onClick={() => handleSelectBU(slice.name)}
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedBU && !isSelected ? 'opacity-20 scale-95' : 'opacity-100 hover:opacity-85'
                    }`}
                    style={{ transformOrigin: '50px 50px' }}
                  />
                  {slice.percent > 0.01 && (
                    <text
                      x={slice.labelX}
                      y={slice.labelY}
                      fill={slice.color === '#eedcd2' || slice.color === '#f3e1d3' ? '#4a3f35' : '#ffffff'}
                      fontSize="4.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none transition-all duration-300"
                      style={{ transformOrigin: '50px 50px', transform: 'rotate(90deg)' }}
                    >
                      {slice.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend / Breakdown List */}
        <div className="flex-1 w-full space-y-2 max-w-sm">
          <div className="flex items-center justify-between text-[11px] font-bold text-text-info uppercase tracking-wider border-b border-border/40 pb-1.5 px-2">
            <span>Business Unit</span>
            <span>Breakdown</span>
          </div>
          <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
            {buSlices.map((slice) => {
              const isSelected = selectedBU === slice.name;
              return (
                <div
                  key={slice.name}
                  onClick={() => handleSelectBU(slice.name)}
                  className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-accent-1/10 border-accent-1/25 shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-hover hover:border-border/30'
                  } ${selectedBU && !isSelected ? 'opacity-40' : 'opacity-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-xs shrink-0" style={{ backgroundColor: slice.color }} />
                    <span className="font-bold text-xs text-text">{slice.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text-info">
                      {slice.count} {slice.count === 1 ? 'ticket' : 'tickets'}
                    </span>
                    <span className="text-[11px] font-semibold text-text-muted w-12 text-right">
                      ({(slice.percent * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppCard>
  );
}
