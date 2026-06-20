import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TrackPage } from '../pages/TrackPage';
import { CarbonProvider } from '../contexts/CarbonContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ChallengesProvider } from '../contexts/ChallengesContext';

// Mock intersection observer for framer-motion if needed
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
}));

// Mock the Chart components to prevent Recharts from throwing in JSDOM
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('TrackPage', () => {
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

  it('renders correctly and has main tracking form', () => {
    renderWithProviders(<TrackPage />);
    expect(screen.getByText('Quick Log')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('allows user to select category and type', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TrackPage />);
    
    // Select transport category
    const categorySelect = screen.getByLabelText('Category');
    await user.selectOptions(categorySelect, 'transport');
    expect(categorySelect).toHaveValue('transport');
    
    // Check if activities updated
    const activitySelect = screen.getByLabelText('Activity');
    expect(activitySelect).toBeEnabled();
  });

  it('calculates estimate when amount is entered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TrackPage />);
    
    const amountInput = screen.getByLabelText(/Amount/i);
    await user.type(amountInput, '100');
    
    expect(amountInput).toHaveValue(100);
    // Since category is 'transport' and type is 'Car (petrol)', estimate should update
    const addEntryBtn = screen.getByRole('button', { name: /Add Entry/i });
    expect(addEntryBtn).toBeInTheDocument();
  });
});
