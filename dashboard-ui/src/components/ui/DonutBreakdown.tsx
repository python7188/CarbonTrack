import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { ArrowRight } from 'lucide-react';
import type { DonutSegment } from '../../types';

interface DonutBreakdownProps {
  segments: DonutSegment[];
  totalValue: number | string;
  unit: string;
}

export const DonutBreakdown: React.FC<DonutBreakdownProps> = ({
  segments,
  totalValue,
  unit,
}) => {
  const chartData = useMemo(
    () => segments.map((seg) => ({ name: seg.name, value: seg.value, color: seg.color })),
    [segments],
  );

  return (
    <div className="glass-card-dark p-7 flex flex-col h-full">
      <h3 className="font-semibold text-[15px] text-white mb-6 tracking-wide">
        Your Footprint Breakdown
      </h3>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Donut */}
        <div className="w-[140px] h-[140px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <span className="text-2xl font-bold text-white">{totalValue}</span>
            <span className="text-[9px] text-[#8FA99D] uppercase tracking-wider">
              {unit}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1 sm:ml-6 w-full sm:w-auto">
          {segments.map((seg) => (
            <div key={seg.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#8FA99D]">
                <span
                  className="w-2 h-2 rounded-full shadow-sm shrink-0"
                  style={{ backgroundColor: seg.color }}
                  aria-hidden="true"
                />
                {seg.name}
              </div>
              <span className="font-semibold text-white">{seg.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action link */}
      <button className="text-xs text-[#8FA99D] hover:text-white mt-6 text-left flex items-center gap-1.5 transition-colors w-fit font-medium">
        View detailed analysis{' '}
        <ArrowRight className="w-3 h-3" aria-hidden="true" />
      </button>

      {/* Visually-hidden table for screen readers */}
      <table className="sr-only">
        <caption>Carbon Footprint Breakdown</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((seg) => (
            <tr key={seg.name}>
              <td>{seg.name}</td>
              <td>{seg.value}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>
              {totalValue} {unit}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
