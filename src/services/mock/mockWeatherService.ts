// ============================================================
// AgriFedX — Mock Weather Service
// ============================================================
// INTEGRATION POINT: Replace with GET /weather?lat=&lon= API call
// ============================================================

import type { WeatherData, Location } from '../../types';

const WEATHER_BY_DISTRICT: Record<string, WeatherData> = {
  Nashik: {
    temperature: 27,
    humidity: 82,
    rainfall: 12,
    windSpeed: 8,
    condition: 'Cloudy',
    forecast: 'Rain likely in next 24 hours',
  },
  Pune: {
    temperature: 25,
    humidity: 74,
    rainfall: 8,
    windSpeed: 10,
    condition: 'Partly Cloudy',
    forecast: 'Light showers expected',
  },
  Ahmednagar: {
    temperature: 30,
    humidity: 68,
    rainfall: 4,
    windSpeed: 12,
    condition: 'Warm',
    forecast: 'Clear skies with moderate humidity',
  },
  Sangli: {
    temperature: 29,
    humidity: 78,
    rainfall: 15,
    windSpeed: 6,
    condition: 'Overcast',
    forecast: 'Heavy rainfall expected',
  },
  Satara: {
    temperature: 24,
    humidity: 85,
    rainfall: 20,
    windSpeed: 5,
    condition: 'Rainy',
    forecast: 'Continuous rain expected for 48 hours',
  },
  Kolhapur: {
    temperature: 26,
    humidity: 80,
    rainfall: 18,
    windSpeed: 7,
    condition: 'Overcast',
    forecast: 'Intermittent rain showers',
  },
};

const DEFAULT_WEATHER: WeatherData = {
  temperature: 28,
  humidity: 75,
  rainfall: 6,
  windSpeed: 9,
  condition: 'Partly Cloudy',
  forecast: 'Normal monsoon conditions',
};

export async function getWeather(location: Location): Promise<WeatherData> {
  await new Promise((r) => setTimeout(r, 200));
  return { ...(WEATHER_BY_DISTRICT[location.district] || DEFAULT_WEATHER) };
}

export const mockWeatherService = { getWeather };
export default mockWeatherService;
