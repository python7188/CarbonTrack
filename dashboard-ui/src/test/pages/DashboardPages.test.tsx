import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InsightsPage from '../../pages/InsightsPage';
import GoalsPage from '../../pages/GoalsPage';
import HistoryPage from '../../pages/HistoryPage';
import FootprintPage from '../../pages/FootprintPage';
import ReducePage from '../../pages/ReducePage';
import { ChallengesProvider } from '../../contexts/ChallengesContext';

window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...(actual as object),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: () => <div>LineChart</div>,
  Line: () => <div>Line</div>,
  PieChart: () => <div>PieChart</div>,
  Pie: () => <div>Pie</div>,
  Cell: () => <div>Cell</div>,
  BarChart: () => <div>BarChart</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div>{children}</div>,
}));

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
    expect(screen.getByText(/Action History/i)).toBeInTheDocument();
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
