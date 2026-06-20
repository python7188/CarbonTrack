export function calculateCO2(category: string, activityType: string, amount: number): number {
  if (amount <= 0 || isNaN(amount)) return 0;
  
  if (activityType === 'CUSTOM') {
    return amount;
  }
  
  let estimate = 0;
  
  if (category === 'transport') {
    if (activityType.includes('diesel')) estimate = amount * 0.17;
    else if (activityType.includes('petrol')) estimate = amount * 0.19;
    else if (activityType.includes('Motorcycle')) estimate = amount * 0.11;
    else if (activityType.includes('Flight')) estimate = amount * 90; // approx 90kg per hour of flight
    else estimate = amount * 0.05; // bus/metro
  } else if (category === 'food') {
    if (activityType.includes('Red meat')) estimate = amount * 6.6;
    else if (activityType.includes('Poultry')) estimate = amount * 1.8;
    else if (activityType.includes('Vegetarian')) estimate = amount * 0.9;
    else if (activityType.includes('Vegan')) estimate = amount * 0.6;
    else if (activityType.includes('Dairy')) estimate = amount * 1.3; // per kg
    else estimate = amount * 2.0;
  } else if (category === 'energy') {
    if (activityType.includes('Electricity')) estimate = amount * 0.8; // kWh
    else if (activityType.includes('LPG')) estimate = amount * 42.5; // per cylinder
    else if (activityType.includes('Generator')) estimate = amount * 2.6; // per liter
    else estimate = amount * 1.5; // generic hours for AC/Geyser
  } else if (category === 'shopping') {
    if (activityType.includes('Clothing')) estimate = amount * 15;
    else if (activityType.includes('Electronics')) estimate = amount * 70;
    else if (activityType.includes('Furniture')) estimate = amount * 50;
    else estimate = amount * 2;
  } else {
    // Default fallback
    estimate = amount * (category === 'transport' ? 0.17 : category === 'energy' ? 0.8 : category === 'food' ? 3.5 : 1.5);
  }
  
  return Math.round(estimate * 10) / 10;
}
