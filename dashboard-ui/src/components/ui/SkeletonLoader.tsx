import React from 'react';
import clsx from 'clsx';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'chart';
  className?: string;
}

const variantStyles: Record<string, string> = {
  card: 'w-full h-36 rounded-3xl',
  text: 'w-full h-4 rounded-md',
  circle: 'w-12 h-12 rounded-full',
  chart: 'w-full h-48 rounded-2xl',
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  className,
}) => {
  return (
    <div
      className={clsx('skeleton', variantStyles[variant], className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
};
