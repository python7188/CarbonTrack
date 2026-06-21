import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingHome from '../../pages/LandingHome';
import LandingFeatures from '../../pages/LandingFeatures';
import LandingAbout from '../../pages/LandingAbout';
import LandingContact from '../../pages/LandingContact';

const renderWithRouter = (ui: React.ReactElement) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('LandingPages', () => {
  it('renders LandingHome smoke test', () => {
    renderWithRouter(<LandingHome />);
    expect(screen.getByText(/The Ultimate Carbon Tracking Engine/i)).toBeInTheDocument();
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
