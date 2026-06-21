import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TrackPage from '../../pages/TrackPage';
import HistoryPage from '../../pages/HistoryPage';

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  localStorage.clear();
});

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...(actual as object),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('Integration Flow: Track to History', () => {
  it('logs a new activity and verifies it appears in the history', async () => {
    const { unmount } = render(
      <MemoryRouter>
        <TrackPage />
      </MemoryRouter>
    );

    // 1. Select activity type "Car (petrol)" (Transport is default category)
    const carBtn = screen.getByRole('button', { name: /Car \(petrol\)/i });
    fireEvent.click(carBtn);

    // 2. Enter amount
    const amountInput = screen.getByPlaceholderText(/ENTER AMOUNT\.\.\./i);
    fireEvent.change(amountInput, { target: { value: '15' } });

    // 3. Submit
    const submitBtn = screen.getByRole('button', { name: /SAVE ACTIVITY/i });
    fireEvent.click(submitBtn);

    // 4. Wait for success toast
    expect(await screen.findByText(/ENTRY LOGGED SUCCESSFULLY/i)).toBeInTheDocument();

    unmount();

    // 5. Render HistoryPage
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    // 6. Verify entry exists in History
    expect(screen.getByText(/Car \(petrol\)/i)).toBeInTheDocument();
    
    // 15 km * 0.192 kg CO2/km = 2.88 kg (may be rounded to 2.90 by toFixed(1) + .0)
    expect(screen.getByText(/2\.(88|90)/i)).toBeInTheDocument();
  });
});
