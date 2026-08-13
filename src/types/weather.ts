export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // State / Province
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export type TemperatureUnit = 'C' | 'F';
export type ThemeMode = 'dark' | 'light';

export type WeatherSimulationType = 
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rainy'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snowy'
  | 'blizzard'
  | 'foggy'
  | 'extreme_hot'
  | 'extreme_cold';

export interface WeatherCondition {
  code: number;
  label: string;
  iconName: string;
  simulationType: WeatherSimulationType;
  bgGradient: {
    day: string;
    night: string;
    lightDay: string;
    lightNight: string;
  };
}

export type AlertSeverity = 'critical' | 'warning' | 'advisory';

export interface WeatherAlert {
  id: string;
  event: string;
  severity: AlertSeverity;
  headline: string;
  description: string;
  instruction?: string;
  category: 'severe_weather' | 'storm' | 'heavy_rain' | 'extreme_heat' | 'extreme_cold' | 'high_wind' | 'fog' | 'uv';
  effective: string;
  expires: string;
}

export interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  condition: WeatherCondition;
  isDay: boolean;
  time: string;
  pressure: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  precipitation: number;
  precipitationProbability: number;
  cloudCover: number;
}

export interface HourlyDataPoint {
  time: string;
  temp: number;
  feelsLike: number;
  weatherCode: number;
  conditionLabel: string;
  iconName: string;
  pop: number; // probability of precipitation %
  precipitation: number; // mm
  windSpeed: number;
  humidity: number;
  isDay: boolean;
}

export interface DailyDataPoint {
  date: string;
  dayName: string;
  weatherCode: number;
  conditionLabel: string;
  iconName: string;
  tempMax: number;
  tempMin: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface HistoricalDayData {
  date: string;
  dateFormatted: string;
  tempMax: number;
  tempMin: number;
  tempMean: number;
  precipitationSum: number;
  rainSum: number;
  snowfallSum: number;
  windSpeedMax: number;
  weatherCode: number;
  conditionLabel: string;
  iconName: string;
}

export interface WeatherHistorySummary {
  periodDays: number;
  avgMaxTemp: number;
  avgMinTemp: number;
  hottestDay: { date: string; temp: number };
  coldestDay: { date: string; temp: number };
  totalPrecipitation: number;
  rainyDaysCount: number;
  maxWindSpeed: number;
  dailyHistory: HistoricalDayData[];
}

export interface CompleteWeatherResponse {
  location: LocationResult;
  current: CurrentWeatherData;
  hourly: HourlyDataPoint[];
  daily: DailyDataPoint[];
  alerts: WeatherAlert[];
}

export type MapLayerType = 'rain' | 'clouds' | 'temp' | 'wind';
