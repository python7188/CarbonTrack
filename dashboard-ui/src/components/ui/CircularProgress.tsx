import React, { useMemo } from 'react';

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  size?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  label,
  size = 112,
}) => {
  const { radius, circumference, strokeDashoffset, center, viewBox } = useMemo(() => {
    const strokeWidth = 8;
    const r = (size - strokeWidth) / 2;
    const c = 2 * Math.PI * r;
    const clampedValue = Math.min(Math.max(value, 0), max);
    const offset = c - (clampedValue / max) * c;
    const ctr = size / 2;
    return {
      radius: r,
      circumference: c,
      strokeDashoffset: offset,
      center: ctr,
      viewBox: `0 0 ${size} ${size}`,
    };
  }, [value, max, size]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${label}: ${value} of ${max}`}
    >
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={viewBox}
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2EEA8B"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(46,234,139,0.5)] transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white tracking-tight">
          {value}
        </span>
        <span className="text-[10px] text-[#8FA99D] uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
};
