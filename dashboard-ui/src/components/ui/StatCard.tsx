import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { StatCardData, SparklinePoint } from '../../types';

interface StatCardProps extends StatCardData {
  index: number;
  sparklineData?: SparklinePoint[];
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  subtitle,
  value,
  unit,
  delta,
  deltaColor,
  deltaBg,
  icon: IconComponent,
  iconColor,
  showSparkline,
  index,
  sparklineData,
}) => {
  const chartData = useMemo(() => {
    if (!showSparkline || !sparklineData) return null;
    return sparklineData.map((point) => ({ value: point.value }));
  }, [showSparkline, sparklineData]);

  return (
    <motion.article
      aria-label={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className="glass-card p-5 flex flex-col relative overflow-hidden group transition-all"
    >
      {/* Header row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[13px] font-semibold text-[#5C6B68]">{title}</h3>
          {subtitle && (
            <p className="text-[11px] text-[#8FA99D] mt-0.5">{subtitle}</p>
          )}
        </div>
        {IconComponent && (
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shadow-sm">
            <IconComponent
              className={`w-6 h-6 ${iconColor ?? 'text-gray-500'}`}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-auto">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-[#16211F] tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-[#5C6B68]">{unit}</span>
          )}
        </div>

        {/* Delta badge */}
        {delta && (
          <div
            className={`mt-3 inline-flex items-center gap-1 ${deltaBg ?? 'bg-gray-100'} ${deltaColor ?? 'text-gray-700'} px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide`}
          >
            {delta}
          </div>
        )}
      </div>

      {/* Sparkline */}
      {showSparkline && chartData && (
        <div className="absolute bottom-4 right-4 w-16 h-8 opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2EEA8B"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.article>
  );
};
