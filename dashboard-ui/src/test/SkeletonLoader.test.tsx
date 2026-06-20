import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders an accessible loading status', () => {
    render(<SkeletonLoader />);
    expect(screen.getByRole('status')).toHaveAccessibleName(/loading/i);
  });
  it('applies the requested variant class', () => {
    render(<SkeletonLoader variant="circle" />);
    expect(screen.getByRole('status')).toHaveClass('rounded-full');
  });
});
