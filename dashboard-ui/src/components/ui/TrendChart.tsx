import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendPoint } from '../../types';

const TABS = ['Week', 'Month', 'Year'] as const;

interface TrendChartProps {
  data: TrendPoint[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  activeTab,
  onTabChange,
}) => {
  const chartData = useMemo(
    () => data.map((point) => ({ name: point.name, value: point.value })),
    [data],
  );

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h3 className="font-semibold text-[#16211F]">Footprint Trend</h3>

        {/* Tab switcher */}
        <div
          className="bg-slate-100/80 p-1 rounded-full flex text-xs font-medium"
          role="tablist"
          aria-label="Trend time range"
        >
          {TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onTabChange(tab)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  isSelected
                    ? 'bg-white shadow-sm text-[#059669]'
                    : 'text-[#8FA99D] hover:text-[#5C6B68]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[140px]" role="tabpanel">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#8FA99D' }}
              dy={10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2EEA8B"
              strokeWidth={3}
              dot={{ r: 4, fill: '#fff', stroke: '#2EEA8B', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
