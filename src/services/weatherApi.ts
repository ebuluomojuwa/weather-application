import {
  LocationResult,
  WeatherCondition,
  WeatherSimulationType,
  CurrentWeatherData,
  HourlyDataPoint,
  DailyDataPoint,
  CompleteWeatherResponse,
  HistoricalDayData,
  WeatherHistorySummary,
  WeatherAlert,
} from '../types/weather';

// WMO Weather Interpretation Codes (WW)
// https://open-meteo.com/en/docs
export function getWmoCondition(code: number, isDay: boolean = true, tempC?: number): WeatherCondition {
  // Check for extreme temperature overrides first if temp is provided
  if (tempC !== undefined && tempC >= 35) {
    return {
      code,
      label: 'Extreme Heatwave',
      iconName: 'Sun',
      simulationType: 'extreme_hot',
      bgGradient: {
        day: 'from-amber-600 via-orange-500 to-rose-600',
        night: 'from-amber-950 via-rose-950 to-slate-950',
        lightDay: 'from-amber-100 via-orange-100 to-rose-200',
        lightNight: 'from-amber-100 via-rose-200 to-slate-300',
      },
    };
  }

  if (tempC !== undefined && tempC <= -5) {
    return {
      code,
      label: 'Freezing Cold',
      iconName: 'Snowflake',
      simulationType: 'extreme_cold',
      bgGradient: {
        day: 'from-cyan-700 via-blue-600 to-indigo-900',
        night: 'from-slate-900 via-blue-950 to-cyan-950',
        lightDay: 'from-cyan-100 via-blue-100 to-indigo-200',
        lightNight: 'from-slate-200 via-blue-200 to-cyan-300',
      },
    };
  }

  switch (code) {
    case 0: // Clear sky
      return {
        code,
        label: 'Clear Sky',
        iconName: isDay ? 'Sun' : 'Moon',
        simulationType: 'sunny',
        bgGradient: {
          day: 'from-sky-500 via-amber-200 to-sky-600',
          night: 'from-slate-900 via-indigo-950 to-slate-950',
          lightDay: 'from-sky-100 via-amber-50 to-blue-200',
          lightNight: 'from-indigo-100 via-slate-100 to-blue-200',
        },
      };
    case 1: // Mainly clear
      return {
        code,
        label: 'Mainly Clear',
        iconName: isDay ? 'Sun' : 'Moon',
        simulationType: 'sunny',
        bgGradient: {
          day: 'from-sky-500 via-sky-300 to-blue-500',
          night: 'from-slate-900 via-indigo-950 to-slate-950',
          lightDay: 'from-sky-100 via-blue-100 to-sky-200',
          lightNight: 'from-slate-100 via-indigo-100 to-sky-200',
        },
      };
    case 2: // Partly cloudy
      return {
        code,
        label: 'Partly Cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        simulationType: 'partly_cloudy',
        bgGradient: {
          day: 'from-blue-500 via-sky-300 to-slate-500',
          night: 'from-slate-900 via-slate-800 to-indigo-950',
          lightDay: 'from-blue-100 via-sky-100 to-slate-200',
          lightNight: 'from-slate-100 via-zinc-200 to-indigo-200',
        },
      };
    case 3: // Overcast
      return {
        code,
        label: 'Overcast Clouds',
        iconName: 'Cloud',
        simulationType: 'cloudy',
        bgGradient: {
          day: 'from-slate-600 via-slate-500 to-zinc-600',
          night: 'from-slate-950 via-slate-900 to-zinc-950',
          lightDay: 'from-slate-100 via-zinc-200 to-slate-300',
          lightNight: 'from-slate-200 via-zinc-300 to-slate-400',
        },
      };
    case 45: // Fog
    case 48: // Depositing rime fog
      return {
        code,
        label: code === 45 ? 'Foggy' : 'Icy Rime Fog',
        iconName: 'CloudFog',
        simulationType: 'foggy',
        bgGradient: {
          day: 'from-slate-500 via-zinc-500 to-sky-800',
          night: 'from-zinc-950 via-slate-900 to-neutral-900',
          lightDay: 'from-slate-100 via-zinc-100 to-slate-200',
          lightNight: 'from-zinc-200 via-slate-200 to-gray-300',
        },
      };
    case 51: // Drizzle light
    case 53: // Drizzle moderate
    case 55: // Drizzle dense
      return {
        code,
        label: 'Light Drizzle',
        iconName: 'CloudDrizzle',
        simulationType: 'rainy',
        bgGradient: {
          day: 'from-slate-600 via-sky-700 to-blue-900',
          night: 'from-slate-950 via-blue-950 to-slate-900',
          lightDay: 'from-slate-100 via-blue-100 to-sky-200',
          lightNight: 'from-slate-200 via-blue-200 to-slate-300',
        },
      };
    case 56: // Freezing drizzle light
    case 57: // Freezing drizzle dense
      return {
        code,
        label: 'Freezing Drizzle',
        iconName: 'CloudSnow',
        simulationType: 'snowy',
        bgGradient: {
          day: 'from-slate-600 via-teal-800 to-slate-900',
          night: 'from-slate-950 via-teal-950 to-cyan-950',
          lightDay: 'from-slate-100 via-teal-100 to-cyan-200',
          lightNight: 'from-slate-200 via-teal-200 to-cyan-300',
        },
      };
    case 61: // Rain slight
    case 63: // Rain moderate
      return {
        code,
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        simulationType: 'rainy',
        bgGradient: {
          day: 'from-slate-700 via-blue-800 to-indigo-950',
          night: 'from-slate-950 via-blue-950 to-black',
          lightDay: 'from-slate-200 via-blue-100 to-indigo-200',
          lightNight: 'from-slate-300 via-blue-200 to-slate-400',
        },
      };
    case 65: // Rain heavy
    case 80: // Rain showers slight
    case 81: // Rain showers moderate
    case 82: // Rain showers violent
      return {
        code,
        label: 'Heavy Rain Showers',
        iconName: 'CloudRainWind',
        simulationType: 'heavy_rain',
        bgGradient: {
          day: 'from-slate-800 via-blue-900 to-slate-950',
          night: 'from-slate-950 via-blue-950 to-neutral-950',
          lightDay: 'from-slate-200 via-blue-200 to-slate-300',
          lightNight: 'from-slate-300 via-blue-300 to-neutral-400',
        },
      };
    case 66: // Freezing rain light
    case 67: // Freezing rain heavy
      return {
        code,
        label: 'Freezing Rain',
        iconName: 'CloudHail',
        simulationType: 'snowy',
        bgGradient: {
          day: 'from-slate-700 via-cyan-900 to-blue-950',
          night: 'from-slate-950 via-cyan-950 to-slate-900',
          lightDay: 'from-slate-200 via-cyan-100 to-blue-200',
          lightNight: 'from-slate-300 via-cyan-200 to-blue-300',
        },
      };
    case 71: // Snow fall slight
    case 73: // Snow fall moderate
      return {
        code,
        label: 'Moderate Snowfall',
        iconName: 'Snowflake',
        simulationType: 'snowy',
        bgGradient: {
          day: 'from-blue-400 via-sky-400 to-indigo-900',
          night: 'from-slate-900 via-indigo-950 to-blue-950',
          lightDay: 'from-blue-100 via-sky-100 to-indigo-200',
          lightNight: 'from-slate-200 via-indigo-200 to-blue-300',
        },
      };
    case 75: // Snow fall heavy
    case 77: // Snow grains
    case 85: // Snow showers slight
    case 86: // Snow showers heavy
      return {
        code,
        label: 'Heavy Snow Blizzard',
        iconName: 'CloudSnow',
        simulationType: 'blizzard',
        bgGradient: {
          day: 'from-slate-400 via-cyan-600 to-slate-900',
          night: 'from-slate-900 via-cyan-950 to-black',
          lightDay: 'from-slate-200 via-cyan-100 to-slate-300',
          lightNight: 'from-slate-300 via-cyan-200 to-zinc-400',
        },
      };
    case 95: // Thunderstorm slight or moderate
    case 96: // Thunderstorm with slight hail
    case 99: // Thunderstorm with heavy hail
      return {
        code,
        label: 'Severe Thunderstorm',
        iconName: 'CloudLightning',
        simulationType: 'thunderstorm',
        bgGradient: {
          day: 'from-slate-900 via-indigo-950 to-purple-950',
          night: 'from-slate-950 via-purple-950 to-black',
          lightDay: 'from-slate-300 via-purple-100 to-indigo-200',
          lightNight: 'from-slate-400 via-purple-200 to-zinc-400',
        },
      };
    default:
      return {
        code,
        label: 'Variable Weather',
        iconName: 'Cloud',
        simulationType: 'partly_cloudy',
        bgGradient: {
          day: 'from-blue-500 via-sky-400 to-indigo-700',
          night: 'from-slate-900 via-indigo-950 to-slate-950',
          lightDay: 'from-blue-100 via-sky-100 to-indigo-200',
          lightNight: 'from-slate-200 via-indigo-200 to-slate-300',
        },
      };
  }
}

// Popular locations for fast default or recommendations
export const DEFAULT_LOCATIONS: LocationResult[] = [
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006 },
  { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
  { id: 1850147, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917 },
  { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522 },
  { id: 2147714, name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093 },
  { id: 360630, name: 'Cairo', country: 'Egypt', admin1: 'Cairo', latitude: 30.0444, longitude: 31.2357 },
  { id: 6167865, name: 'Toronto', country: 'Canada', admin1: 'Ontario', latitude: 43.6532, longitude: -79.3832 },
  { id: 1275339, name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777 },
];

/**
 * Search locations using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=en&format=json`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to search location');

    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country_code: item.country_code,
      admin1: item.admin1,
      admin2: item.admin2,
      country: item.country,
      timezone: item.timezone,
      population: item.population,
    }));
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
}

/**
 * Reverse geocode latitude and longitude to location name
 */
export async function reverseGeocode(lat: number, lon: number): Promise<LocationResult> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(
      2
    )}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        return {
          id: item.id,
          name: item.name,
          latitude: lat,
          longitude: lon,
          country: item.country,
          admin1: item.admin1,
        };
      }
    }
  } catch (err) {
    console.warn('Reverse geocode failed, using generic name', err);
  }

  return {
    id: Math.round(lat * 10000 + lon),
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
    country: '',
  };
}

/**
 * Derive severe weather alerts dynamically based on meteorological condition thresholds
 */
function deriveWeatherAlerts(
  location: LocationResult,
  current: CurrentWeatherData,
  daily: DailyDataPoint[]
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const locName = location.name;

  // 1. Extreme Heat Alert
  if (current.temperature >= 35) {
    alerts.push({
      id: `alert-heat-${location.id}`,
      event: 'Extreme Heat Warning',
      severity: 'critical',
      headline: `Severe Heatwave Warning in ${locName}`,
      description: `Temperature has reached ${Math.round(current.temperature)}°C. High risk of heat stroke and dehydration. Stay indoors in air-conditioned areas and stay hydrated.`,
      instruction: 'Drink plenty of water, avoid direct sun exposure between 11 AM and 4 PM, and check on vulnerable individuals.',
      category: 'extreme_heat',
      effective: 'Now',
      expires: 'In 12 hours',
    });
  }

  // 2. Extreme Cold Alert
  if (current.temperature <= -5) {
    alerts.push({
      id: `alert-cold-${location.id}`,
      event: 'Freeze & Frost Warning',
      severity: 'warning',
      headline: `Freezing Cold Conditions in ${locName}`,
      description: `Sub-zero temperatures of ${Math.round(current.temperature)}°C recorded. Freezing conditions may cause icy roads and frostbite risk.`,
      instruction: 'Wear multiple thermal layers, cover exposed skin, and protect household water pipes from freezing.',
      category: 'extreme_cold',
      effective: 'Now',
      expires: 'Tomorrow morning',
    });
  }

  // 3. Thunderstorm & Severe Weather
  if ([95, 96, 99].includes(current.weatherCode)) {
    alerts.push({
      id: `alert-storm-${location.id}`,
      event: 'Severe Thunderstorm Warning',
      severity: 'critical',
      headline: `Thunderstorm with Lightning & Hail in ${locName}`,
      description: `Active severe thunderstorm detected in the area. Potential for damaging winds, sudden downpours, and lightning hazard.`,
      instruction: 'Seek sturdy indoor shelter immediately. Stay away from electrical equipment, tall trees, and open water.',
      category: 'storm',
      effective: 'Now',
      expires: 'In 3 hours',
    });
  }

  // 4. Heavy Rain / Flood Risk
  if ([65, 81, 82].includes(current.weatherCode) || current.precipitation >= 10) {
    alerts.push({
      id: `alert-rain-${location.id}`,
      event: 'Heavy Rainfall & Flash Flood Advisory',
      severity: 'warning',
      headline: `Heavy Downpours Active in ${locName}`,
      description: `High rainfall rates observed (${current.precipitation} mm/h). Localized street flooding and poor driving visibility reported.`,
      instruction: 'Reduce driving speeds and keep headlights on. Never drive or walk through flooded roadways.',
      category: 'heavy_rain',
      effective: 'Now',
      expires: 'In 6 hours',
    });
  }

  // 5. High Wind Warning
  if (current.windSpeed >= 45) {
    alerts.push({
      id: `alert-wind-${location.id}`,
      event: 'Gale Force Wind Advisory',
      severity: current.windSpeed >= 65 ? 'critical' : 'warning',
      headline: `High Wind Gusts Reaching ${Math.round(current.windSpeed)} km/h`,
      description: `Sustained strong winds and sudden gusts could knock down tree branches and loose outdoor objects.`,
      instruction: 'Secure outdoor furniture and trash cans. Use caution when driving high-profile vehicles on highways.',
      category: 'high_wind',
      effective: 'Now',
      expires: 'In 8 hours',
    });
  }

  // 6. High UV Alert
  if (current.uvIndex >= 8) {
    alerts.push({
      id: `alert-uv-${location.id}`,
      event: 'Extreme UV Radiation Advisory',
      severity: 'advisory',
      headline: `Very High UV Index (${current.uvIndex}) in ${locName}`,
      description: `Unprotected skin and eyes can burn rapidly under intense ultraviolet sunlight.`,
      instruction: 'Apply SPF 30+ sunscreen, wear UV-blocking sunglasses, and seek shade during midday hours.',
      category: 'uv',
      effective: '10:00 AM',
      expires: '05:00 PM',
    });
  }

  // 7. Dense Fog Alert
  if ([45, 48].includes(current.weatherCode)) {
    alerts.push({
      id: `alert-fog-${location.id}`,
      event: 'Dense Fog Advisory',
      severity: 'advisory',
      headline: `Low Visibility Fog in ${locName}`,
      description: `Fog reduced horizontal visibility significantly across nearby highways and travel corridors.`,
      instruction: 'Drive with low-beam headlights, maintain safe trailing distances, and allow extra commute time.',
      category: 'fog',
      effective: 'Now',
      expires: 'In 4 hours',
    });
  }

  // 8. High Rain Probability Tomorrow
  if (daily[1] && daily[1].precipitationProbabilityMax >= 80 && alerts.length === 0) {
    alerts.push({
      id: `alert-rain-tomorrow-${location.id}`,
      event: 'High Rain Probability Outlook',
      severity: 'advisory',
      headline: `${daily[1].precipitationProbabilityMax}% Chance of Rain Expected Tomorrow`,
      description: `Widespread rainfall expected tomorrow in ${locName} with accumulation up to ${daily[1].precipitationSum} mm.`,
      instruction: 'Plan outdoor activities accordingly and keep an umbrella or raincoat handy.',
      category: 'heavy_rain',
      effective: 'Tomorrow',
      expires: 'Tomorrow evening',
    });
  }

  return alerts;
}

/**
 * Fetch complete current, hourly, and 10-day daily forecast weather data
 */
export async function fetchWeatherData(location: LocationResult): Promise<CompleteWeatherResponse> {
  const { latitude, longitude } = location;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '10',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather data fetch failed: ${response.statusText}`);
  }

  const data = await response.json();

  // Current
  const currentRaw = data.current;
  const dailyRaw = data.daily;
  const tempC = currentRaw.temperature_2m;
  const isDay = currentRaw.is_day === 1;
  const condition = getWmoCondition(currentRaw.weather_code, isDay, tempC);

  const current: CurrentWeatherData = {
    temperature: currentRaw.temperature_2m,
    feelsLike: currentRaw.apparent_temperature,
    humidity: currentRaw.relative_humidity_2m,
    windSpeed: currentRaw.wind_speed_10m,
    windDirection: currentRaw.wind_direction_10m,
    weatherCode: currentRaw.weather_code,
    condition,
    isDay,
    time: currentRaw.time,
    pressure: currentRaw.pressure_msl || currentRaw.surface_pressure,
    uvIndex: dailyRaw.uv_index_max?.[0] || 5,
    visibility: 10000, // standard meter visibility estimation
    dewPoint: Math.round(
      currentRaw.temperature_2m - (100 - currentRaw.relative_humidity_2m) / 5
    ),
    tempMax: dailyRaw.temperature_2m_max?.[0] ?? currentRaw.temperature_2m + 3,
    tempMin: dailyRaw.temperature_2m_min?.[0] ?? currentRaw.temperature_2m - 4,
    sunrise: dailyRaw.sunrise?.[0]
      ? new Date(dailyRaw.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '06:00 AM',
    sunset: dailyRaw.sunset?.[0]
      ? new Date(dailyRaw.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '07:30 PM',
    precipitation: currentRaw.precipitation || 0,
    precipitationProbability: dailyRaw.precipitation_probability_max?.[0] || 0,
    cloudCover: currentRaw.cloud_cover || 20,
  };

  // Hourly (next 24 hours)
  const hourlyRaw = data.hourly;
  const hourly: HourlyDataPoint[] = [];
  const nowIndex = hourlyRaw.time.findIndex((t: string) => new Date(t) >= new Date());
  const startIndex = nowIndex >= 0 ? nowIndex : 0;

  for (let i = startIndex; i < Math.min(startIndex + 24, hourlyRaw.time.length); i++) {
    const tIsDay = hourlyRaw.is_day?.[i] === 1;
    const tCode = hourlyRaw.weather_code[i];
    const tTemp = hourlyRaw.temperature_2m[i];
    const cond = getWmoCondition(tCode, tIsDay, tTemp);

    const timeObj = new Date(hourlyRaw.time[i]);
    const formattedTime = timeObj.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

    hourly.push({
      time: formattedTime,
      temp: tTemp,
      feelsLike: hourlyRaw.apparent_temperature[i],
      weatherCode: tCode,
      conditionLabel: cond.label,
      iconName: cond.iconName,
      pop: hourlyRaw.precipitation_probability[i] || 0,
      precipitation: hourlyRaw.precipitation[i] || 0,
      windSpeed: hourlyRaw.wind_speed_10m[i],
      humidity: hourlyRaw.relative_humidity_2m[i],
      isDay: tIsDay,
    });
  }

  // Daily (10 days)
  const daily: DailyDataPoint[] = [];
  for (let i = 0; i < dailyRaw.time.length; i++) {
    const dateStr = dailyRaw.time[i];
    const dDate = new Date(dateStr);
    const dayName =
      i === 0
        ? 'Today'
        : dDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const dCode = dailyRaw.weather_code[i];
    const maxTemp = dailyRaw.temperature_2m_max[i];
    const cond = getWmoCondition(dCode, true, maxTemp);

    daily.push({
      date: dateStr,
      dayName,
      weatherCode: dCode,
      conditionLabel: cond.label,
      iconName: cond.iconName,
      tempMax: maxTemp,
      tempMin: dailyRaw.temperature_2m_min[i],
      precipitationProbabilityMax: dailyRaw.precipitation_probability_max?.[i] || 0,
      precipitationSum: dailyRaw.precipitation_sum?.[i] || 0,
      windSpeedMax: dailyRaw.wind_speed_10m_max?.[i] || 0,
      uvIndexMax: dailyRaw.uv_index_max?.[i] || 0,
      sunrise: dailyRaw.sunrise?.[i]
        ? new Date(dailyRaw.sunrise[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '06:00 AM',
      sunset: dailyRaw.sunset?.[i]
        ? new Date(dailyRaw.sunset[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '07:30 PM',
    });
  }

  // Weather Alerts
  const alerts = deriveWeatherAlerts(location, current, daily);

  return {
    location,
    current,
    hourly,
    daily,
    alerts,
  };
}

/**
 * Fetch Historical Weather Data for past 7 days or past 30 days
 */
export async function fetchWeatherHistory(
  location: LocationResult,
  days: 7 | 30 = 7
): Promise<WeatherHistorySummary> {
  const { latitude, longitude } = location;

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1); // yesterday
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'temperature_2m_mean',
      'precipitation_sum',
      'rain_sum',
      'snowfall_sum',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
  });

  const url = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return fetchWeatherHistoryFallback(location, days);
    }

    const data = await response.json();
    const dailyRaw = data.daily;

    if (!dailyRaw || !dailyRaw.time || dailyRaw.time.length === 0) {
      return fetchWeatherHistoryFallback(location, days);
    }

    const dailyHistory: HistoricalDayData[] = [];
    let totalTempMax = 0;
    let totalTempMin = 0;
    let totalPrecip = 0;
    let rainyDays = 0;
    let maxWind = 0;

    let hottest = { date: '', temp: -999 };
    let coldest = { date: '', temp: 999 };

    for (let i = 0; i < dailyRaw.time.length; i++) {
      const dateStr = dailyRaw.time[i];
      const dMax = dailyRaw.temperature_2m_max[i];
      const dMin = dailyRaw.temperature_2m_min[i];
      const dMean = dailyRaw.temperature_2m_mean?.[i] ?? (dMax + dMin) / 2;
      const dPrecip = dailyRaw.precipitation_sum?.[i] || 0;
      const dRain = dailyRaw.rain_sum?.[i] || 0;
      const dSnow = dailyRaw.snowfall_sum?.[i] || 0;
      const dWind = dailyRaw.wind_speed_10m_max?.[i] || 0;
      const dCode = dailyRaw.weather_code[i];

      const cond = getWmoCondition(dCode, true, dMax);

      const dDate = new Date(dateStr);
      const dateFormatted = dDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      if (dMax > hottest.temp) {
        hottest = { date: dateFormatted, temp: dMax };
      }
      if (dMin < coldest.temp) {
        coldest = { date: dateFormatted, temp: dMin };
      }

      if (dPrecip > 0.5) rainyDays++;
      if (dWind > maxWind) maxWind = dWind;

      totalTempMax += dMax;
      totalTempMin += dMin;
      totalPrecip += dPrecip;

      dailyHistory.push({
        date: dateStr,
        dateFormatted,
        tempMax: dMax,
        tempMin: dMin,
        tempMean: Math.round(dMean * 10) / 10,
        precipitationSum: Math.round(dPrecip * 10) / 10,
        rainSum: Math.round(dRain * 10) / 10,
        snowfallSum: Math.round(dSnow * 10) / 10,
        windSpeedMax: Math.round(dWind * 10) / 10,
        weatherCode: dCode,
        conditionLabel: cond.label,
        iconName: cond.iconName,
      });
    }

    const count = dailyHistory.length || 1;

    return {
      periodDays: days,
      avgMaxTemp: Math.round((totalTempMax / count) * 10) / 10,
      avgMinTemp: Math.round((totalTempMin / count) * 10) / 10,
      hottestDay: hottest.temp === -999 ? { date: 'N/A', temp: 0 } : hottest,
      coldestDay: coldest.temp === 999 ? { date: 'N/A', temp: 0 } : coldest,
      totalPrecipitation: Math.round(totalPrecip * 10) / 10,
      rainyDaysCount: rainyDays,
      maxWindSpeed: Math.round(maxWind * 10) / 10,
      dailyHistory,
    };
  } catch (err) {
    console.warn('Archive API failed, trying fallback:', err);
    return fetchWeatherHistoryFallback(location, days);
  }
}

async function fetchWeatherHistoryFallback(
  location: LocationResult,
  days: number
): Promise<WeatherHistorySummary> {
  const { latitude, longitude } = location;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&past_days=${days}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();
  const dailyRaw = data.daily;

  const dailyHistory: HistoricalDayData[] = [];
  let totalTempMax = 0;
  let totalTempMin = 0;
  let totalPrecip = 0;
  let rainyDays = 0;
  let maxWind = 0;

  let hottest = { date: '', temp: -999 };
  let coldest = { date: '', temp: 999 };

  const limit = Math.min(days, dailyRaw.time.length);
  for (let i = 0; i < limit; i++) {
    const dateStr = dailyRaw.time[i];
    const dMax = dailyRaw.temperature_2m_max[i];
    const dMin = dailyRaw.temperature_2m_min[i];
    const dPrecip = dailyRaw.precipitation_sum[i] || 0;
    const dWind = dailyRaw.wind_speed_10m_max[i] || 0;
    const dCode = dailyRaw.weather_code[i];

    const cond = getWmoCondition(dCode, true, dMax);
    const dDate = new Date(dateStr);
    const dateFormatted = dDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (dMax > hottest.temp) hottest = { date: dateFormatted, temp: dMax };
    if (dMin < coldest.temp) coldest = { date: dateFormatted, temp: dMin };
    if (dPrecip > 0.5) rainyDays++;
    if (dWind > maxWind) maxWind = dWind;

    totalTempMax += dMax;
    totalTempMin += dMin;
    totalPrecip += dPrecip;

    dailyHistory.push({
      date: dateStr,
      dateFormatted,
      tempMax: dMax,
      tempMin: dMin,
      tempMean: Math.round(((dMax + dMin) / 2) * 10) / 10,
      precipitationSum: Math.round(dPrecip * 10) / 10,
      rainSum: Math.round(dPrecip * 10) / 10,
      snowfallSum: 0,
      windSpeedMax: Math.round(dWind * 10) / 10,
      weatherCode: dCode,
      conditionLabel: cond.label,
      iconName: cond.iconName,
    });
  }

  const count = dailyHistory.length || 1;

  return {
    periodDays: days,
    avgMaxTemp: Math.round((totalTempMax / count) * 10) / 10,
    avgMinTemp: Math.round((totalTempMin / count) * 10) / 10,
    hottestDay: hottest,
    coldestDay: coldest,
    totalPrecipitation: Math.round(totalPrecip * 10) / 10,
    rainyDaysCount: rainyDays,
    maxWindSpeed: Math.round(maxWind * 10) / 10,
    dailyHistory,
  };
}

/**
 * Format functions according to C/F unit selection
 */
export function formatTemp(tempC: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const tempF = Math.round((tempC * 9) / 5 + 32);
    return `${tempF}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatTempNumber(tempC: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export function formatWindSpeed(kmh: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecipitation(mm: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const inches = (mm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatVisibility(meters: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const miles = (meters / 1609.34).toFixed(1);
    return `${miles} mi`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

export function getWindDirectionLabel(degree: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degree % 360) / 22.5);
  return directions[index % 16];
}
