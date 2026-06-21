import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import { ChallengesProvider } from '../contexts/ChallengesContext';

// Mock intersection observer for framer-motion
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock recharts ResponsiveContainer (crashes in jsdom)
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...(actual as object),
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

// Mock @react-three/fiber Canvas (no WebGL in jsdom)
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useFrame: vi.fn(),
}));

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  Sphere: () => null,
  Points: () => null,
  PointMaterial: () => null,
  MeshDistortMaterial: () => null,
}));

function renderWithProviders(component: React.ReactNode) {
  return render(
    <BrowserRouter>
      <ChallengesProvider>{component}</ChallengesProvider>
    </BrowserRouter>
  );
}

describe('DashboardPage', () => {
  it('renders the main dashboard sections', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Total Footprint')).toBeInTheDocument();
    expect(screen.getByText('Footprint Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Footprint Trend')).toBeInTheDocument();
    expect(screen.getByText('Active Challenges')).toBeInTheDocument();
  });
});
