import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { CarbonProvider } from '../contexts/CarbonContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ChallengesProvider } from '../contexts/ChallengesContext';

// Mock intersection observer for framer-motion
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
}));

// Mock Recharts to avoid JS DOM issues
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('DashboardPage', () => {
  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <CarbonProvider>
            <ChallengesProvider>
              {component}
            </ChallengesProvider>
          </CarbonProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the dashboard correctly', () => {
    renderWithProviders(<DashboardPage />);
    
    // Check if main widgets load
    expect(screen.getByText('Today\'s Impact')).toBeInTheDocument();
    expect(screen.getByText('Carbon Score')).toBeInTheDocument();
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
  });
});
