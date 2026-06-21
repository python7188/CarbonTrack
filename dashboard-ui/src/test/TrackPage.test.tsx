import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TrackPage from '../pages/TrackPage';

// Mock framer-motion AnimatePresence to just render children
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...(actual as object),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

beforeEach(() => localStorage.clear());

describe('TrackPage', () => {
  it('renders the activity logging form heading', () => {
    render(<TrackPage />);
    expect(screen.getByText('Log Activities')).toBeInTheDocument();
    expect(screen.getByText('1. Select Category')).toBeInTheDocument();
  });

  it('renders all four category buttons', () => {
    render(<TrackPage />);
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Shopping')).toBeInTheDocument();
  });

  it('shows transport activities by default', () => {
    render(<TrackPage />);
    expect(screen.getByRole('button', { name: 'Car (petrol)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Car (diesel)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Motorcycle' })).toBeInTheDocument();
  });

  it('lets the user pick an activity and marks it pressed', () => {
    render(<TrackPage />);
    const petrolBtn = screen.getByRole('button', { name: 'Car (petrol)' });
    fireEvent.click(petrolBtn);
    expect(petrolBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows validation error when submitting without an activity', async () => {
    render(<TrackPage />);

    // Fill amount but skip activity selection
    const amountInput = screen.getByPlaceholderText('ENTER AMOUNT...');
    fireEvent.change(amountInput, { target: { value: '10' } });

    const submitBtn = screen.getByRole('button', { name: /SAVE ACTIVITY/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Please select an activity type.')).toBeInTheDocument();
  });

  it('shows validation error when amount is missing', async () => {
    render(<TrackPage />);

    // Select an activity but skip amount
    fireEvent.click(screen.getByRole('button', { name: 'Car (petrol)' }));

    const submitBtn = screen.getByRole('button', { name: /SAVE ACTIVITY/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Please enter a valid amount greater than 0.')).toBeInTheDocument();
  });
});
