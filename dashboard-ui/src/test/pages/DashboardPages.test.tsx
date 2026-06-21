import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InsightsPage from '../../pages/InsightsPage';
import GoalsPage from '../../pages/GoalsPage';
import HistoryPage from '../../pages/HistoryPage';
import FootprintPage from '../../pages/FootprintPage';
import ReducePage from '../../pages/ReducePage';
import { ChallengesProvider } from '../../contexts/ChallengesContext';

vi.mock('../../lib/storage', () => ({
  getHistory: () => [
    { id: '1', category: 'transport', activity: 'Car', amount: 10, unit: 'km', co2: 2.5, timestamp: new Date().toISOString() }
  ],
  saveHistory: vi.fn(),
  getEcoScore: () => 85,
}));

vi.mock('../../hooks/useGeminiChat', () => ({
  useGeminiChat: () => ({
    messages: [{ role: 'model', text: 'You are doing great!' }],
    sendMessage: vi.fn(),
    isLoading: false,
    error: null,
    clearHistory: vi.fn(),
  })
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ChallengesProvider>
        {ui}
      </ChallengesProvider>
    </BrowserRouter>
  );
};

describe('InsightsPage', () => {
  it('renders insights correctly', () => {
    renderWithProviders(<InsightsPage />);
    expect(screen.getByText(/AI Insights/i)).toBeInTheDocument();
  });
});

describe('GoalsPage', () => {
  it('renders active and available challenges', () => {
    renderWithProviders(<GoalsPage />);
    expect(screen.getByText(/Goals & Challenges/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Challenges/i)).toBeInTheDocument();
  });
});

describe('HistoryPage', () => {
  it('renders the activity history', () => {
    renderWithProviders(<HistoryPage />);
    expect(screen.getByText(/Activity History/i)).toBeInTheDocument();
    expect(screen.getByText(/Car/i)).toBeInTheDocument();
  });
});

describe('FootprintPage', () => {
  it('renders FootprintPage smoke test', () => {
    renderWithProviders(<FootprintPage />);
    expect(screen.getByText(/My Footprint/i)).toBeInTheDocument();
  });
});

describe('ReducePage', () => {
  it('renders ReducePage smoke test', () => {
    renderWithProviders(<ReducePage />);
    expect(screen.getByText(/Reduce Impact/i)).toBeInTheDocument();
  });
});
