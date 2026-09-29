export type Mode = 'demo' | 'live';
export type Page = 'Dashboard' | 'Crop Advisory' | 'Disease Detection' | 'Soil Analysis' | 'Sensor Monitoring' | 'Recommendations' | 'Settings';
export type Reading = { soilMoisture: number; soilPH: number; temperature: number; humidity: number; timestamp?: string };

export const demoReading: Reading = { soilMoisture: 42, soilPH: 6.8, temperature: 28, humidity: 65 };
export const demoWeather = { location: 'Haveri, Karnataka', temperature: 32, humidity: 65, rainfall: 4, condition: 'Partly cloudy' };
export const crops = [
  { name: 'Groundnut', score: 92, tone: 'green' }, { name: 'Maize', score: 86, tone: 'green' },
  { name: 'Cotton', score: 74, tone: 'amber' }, { name: 'Rice', score: 61, tone: 'blue' },
];
export const trend = [
  { time: '08:00', moisture: 39, temperature: 26, humidity: 61, ph: 6.6 },
  { time: '10:00', moisture: 41, temperature: 27, humidity: 63, ph: 6.7 },
  { time: '12:00', moisture: 42, temperature: 29, humidity: 65, ph: 6.8 },
  { time: '14:00', moisture: 44, temperature: 30, humidity: 67, ph: 6.8 },
  { time: '16:00', moisture: 43, temperature: 28, humidity: 66, ph: 6.9 },
];
export function validateReading(r: Reading) { return r.soilMoisture >= 0 && r.soilMoisture <= 100 && r.soilPH >= 0 && r.soilPH <= 14 && r.humidity >= 0 && r.humidity <= 100 && r.temperature >= -40 && r.temperature <= 85; }
