import { describe, it, expect } from 'vitest';
import { calculateCO2 } from '../lib/carbonMath';

describe('Carbon Math Calculation', () => {
  it('handles negative or invalid amounts', () => {
    expect(calculateCO2('transport', 'Car', -10)).toBe(0);
    expect(calculateCO2('transport', 'Car', NaN)).toBe(0);
  });

  it('handles CUSTOM activity type directly', () => {
    expect(calculateCO2('other', 'CUSTOM', 42.5)).toBe(42.5);
  });

  it('calculates transport emissions correctly', () => {
    expect(calculateCO2('transport', 'Car (Petrol/Diesel)', 100)).toBe(20);
    expect(calculateCO2('transport', 'Flight (Domestic)', 1000)).toBe(250);
    expect(calculateCO2('transport', 'Public Transit (Bus/Train)', 50)).toBe(2.5);
  });

  it('calculates food emissions correctly', () => {
    expect(calculateCO2('food', 'Meat-heavy Meal', 2)).toBe(10);
    expect(calculateCO2('food', 'Vegetarian Meal (Dairy)', 3)).toBe(6);
    expect(calculateCO2('food', 'Vegan/Plant-based', 4)).toBe(2);
  });

  it('calculates energy emissions correctly', () => {
    expect(calculateCO2('energy', 'Electricity (Grid)', 100)).toBe(80);
  });

  it('calculates fallback defaults correctly', () => {
    expect(calculateCO2('shopping', 'Clothing', 10)).toBe(15);
  });
});
