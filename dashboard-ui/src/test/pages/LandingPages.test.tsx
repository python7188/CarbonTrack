import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingHome from '../../src/pages/LandingHome';
import LandingFeatures from '../../src/pages/LandingFeatures';
import LandingAbout from '../../src/pages/LandingAbout';
import LandingContact from '../../src/pages/LandingContact';

const renderWithRouter = (ui: React.ReactElement) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('LandingPages', () => {
  it('renders LandingHome smoke test', () => {
    renderWithRouter(<LandingHome />);
    expect(screen.getByText(/Brutal Honesty/i)).toBeInTheDocument();
  });

  it('renders LandingFeatures smoke test', () => {
    renderWithRouter(<LandingFeatures />);
    expect(screen.getByText(/Built For/i)).toBeInTheDocument();
  });

  it('renders LandingAbout smoke test', () => {
    renderWithRouter(<LandingAbout />);
    expect(screen.getByText(/The Manifesto/i)).toBeInTheDocument();
  });

  it('renders LandingContact smoke test', () => {
    renderWithRouter(<LandingContact />);
    expect(screen.getByText(/Transmission Portal/i)).toBeInTheDocument();
  });
});
