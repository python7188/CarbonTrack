import { describe, it, expect } from 'vitest';
import { calculateCO2 } from '../lib/carbonMath';

describe('calculateCO2', () => {
  describe('guard clauses', () => {
    it('returns 0 for zero or negative amounts', () => {
      expect(calculateCO2('transport', 'Car (petrol)', 0)).toBe(0);
      expect(calculateCO2('transport', 'Car (petrol)', -10)).toBe(0);
    });
    it('returns 0 for NaN amounts', () => {
      expect(calculateCO2('transport', 'Car (petrol)', NaN)).toBe(0);
    });
    it('returns the raw amount for CUSTOM activities, unrounded', () => {
      expect(calculateCO2('other', 'CUSTOM', 42.53)).toBe(42.53);
    });
  });

  describe('transport category', () => {
    it('petrol cars use 0.19/km', () => {
      expect(calculateCO2('transport', 'Car (petrol)', 100)).toBe(19);
    });
    it('diesel cars use 0.17/km', () => {
      expect(calculateCO2('transport', 'Car (diesel)', 100)).toBe(17);
    });
    it('motorcycles use 0.11/km', () => {
      expect(calculateCO2('transport', 'Motorcycle', 100)).toBe(11);
    });
    it('domestic flights use 90/hr', () => {
      expect(calculateCO2('transport', 'Flight (domestic)', 2)).toBe(180);
    });
    it('falls back to 0.05/km for unmatched transport', () => {
      expect(calculateCO2('transport', 'Bus/Metro', 50)).toBe(2.5);
    });
  });

  describe('food category', () => {
    it('red meat meals use 6.6/meal', () => {
      expect(calculateCO2('food', 'Red meat meal', 2)).toBe(13.2);
    });
    it('poultry meals use 1.8/meal', () => {
      expect(calculateCO2('food', 'Poultry meal', 2)).toBe(3.6);
    });
    it('vegetarian meals use 0.9/meal', () => {
      expect(calculateCO2('food', 'Vegetarian meal', 3)).toBe(2.7);
    });
    it('vegan meals use 0.6/meal', () => {
      expect(calculateCO2('food', 'Vegan meal', 4)).toBe(2.4);
    });
    it('dairy products use 1.3/kg', () => {
      expect(calculateCO2('food', 'Dairy products', 2)).toBe(2.6);
    });
    it('falls back to 2.0 for unmatched food', () => {
      expect(calculateCO2('food', 'Mystery snack', 2)).toBe(4);
    });
  });

  describe('energy category', () => {
    it('electricity uses 0.8/kWh', () => {
      expect(calculateCO2('energy', 'Electricity', 100)).toBe(80);
    });
    it('LPG cooking uses 42.5/cylinder', () => {
      expect(calculateCO2('energy', 'LPG cooking', 2)).toBe(85);
    });
    it('generators use 2.6/liter', () => {
      expect(calculateCO2('energy', 'Generator', 5)).toBe(13);
    });
    it('falls back to 1.5/hr for unmatched energy', () => {
      expect(calculateCO2('energy', 'Air conditioning', 3)).toBe(4.5);
    });
  });

  describe('shopping category', () => {
    it('clothing uses 15/item', () => {
      expect(calculateCO2('shopping', 'Clothing', 10)).toBe(150);
    });
    it('electronics use 70/item', () => {
      expect(calculateCO2('shopping', 'Electronics', 2)).toBe(140);
    });
    it('furniture uses 50/item', () => {
      expect(calculateCO2('shopping', 'Furniture', 1)).toBe(50);
    });
    it('falls back to 2/item for unmatched shopping', () => {
      expect(calculateCO2('shopping', 'Groceries (packaged)', 5)).toBe(10);
    });
  });

  describe('unrecognized category', () => {
    it('uses the generic 1.5 multiplier', () => {
      expect(calculateCO2('waste', 'Landfill bag', 10)).toBe(15);
    });
  });
});
