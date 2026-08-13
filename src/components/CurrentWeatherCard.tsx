import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Snowflake,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Sparkles,
  Thermometer,
  Compass,
} from 'lucide-react';
import { CurrentWeatherData, LocationResult, TemperatureUnit, WeatherSimulationType, ThemeMode } from '../types/weather';
import { formatTemp, formatWindSpeed } from '../services/weatherApi';

interface CurrentWeatherCardProps {
  current: CurrentWeatherData;
  location: LocationResult;
  unit: TemperatureUnit;
  activeSimulation: WeatherSimulationType;
  isCustomSimulation: boolean;
  onResetSimulation: () => void;
  themeMode?: ThemeMode;
}

// Icon selector helper
export const getWeatherIcon = (iconName: string, className = 'w-8 h-8') => {
  switch (iconName) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-300`} />;
    case 'CloudMoon':
      return <CloudMoon className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-sky-400`} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${className} text-blue-400`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-amber-400`} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-sky-200`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-slate-100`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-slate-400`} />;
    default:
      return <Cloud className={`${className} text-slate-300`} />;
  }
};

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  location,
  unit,
  activeSimulation,
  isCustomSimulation,
  onResetSimulation,
  themeMode = 'dark',
}) => {
  const isLight = themeMode === 'light';

  // UV Index rating helper
  const getUvCategory = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-500 bg-emerald-500/10' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-amber-500 bg-amber-500/10' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-500 bg-orange-500/10' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-500 bg-rose-500/10' };
    return { label: 'Extreme', color: 'text-purple-500 bg-purple-500/10' };
  };

  const uvCat = getUvCategory(current.uvIndex);

  return (
    <div
      id="current-weather-hero-card"
      className={`relative w-full rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden transition-all border backdrop-blur-2xl ${
        isLight
          ? 'bg-white/80 border-slate-200/80 text-slate-800'
          : 'bg-slate-900/60 border-slate-800/80 text-white'
      }`}
    >
      {/* Simulation Banner Notification if manual preview active */}
      {isCustomSimulation && (
        <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-between gap-3 text-xs md:text-sm text-amber-500 font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
            <span>
              <strong>Simulation Mode:</strong> Visualizing <em>{activeSimulation.replace('_', ' ')}</em> weather effects!
            </span>
          </div>
          <button
            id="reset-simulation-btn"
            onClick={onResetSimulation}
            className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold transition-all hover:bg-amber-400 text-xs shrink-0 shadow-sm"
          >
            Reset to Live
          </button>
        </div>
      )}

      {/* Main Temp & Condition Hero */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8 pb-8 border-b ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="space-y-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            Live Weather Conditions
          </div>

          <h2 className={`text-3xl md:text-5xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {location.name}
          </h2>

          <p className={`text-sm md:text-base font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {location.admin1 ? `${location.admin1}, ` : ''}
            {location.country}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className={`p-2.5 rounded-2xl border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/60 border-slate-700'
            }`}>
              {getWeatherIcon(current.condition.iconName, 'w-8 h-8')}
            </div>
            <div>
              <p className={`text-lg md:text-xl font-extrabold capitalize ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {current.condition.label}
              </p>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Feels like {formatTemp(current.feelsLike, unit)}
              </p>
            </div>
          </div>
        </div>

        {/* Big Temperature Display */}
        <div className="flex flex-col items-start lg:items-end justify-center">
          <div className={`text-6xl md:text-8xl font-black tracking-tighter flex items-start ${
            isLight ? 'text-slate-900' : 'text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400'
          }`}>
            {formatTemp(current.temperature, unit).replace(/[°CF]/g, '')}
            <span className="text-3xl md:text-5xl font-light text-sky-400 mt-2 ml-1">
              °{unit}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm font-semibold mt-2">
            <span className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
              High: {formatTemp(current.tempMax, unit)}
            </span>
            <span className="flex items-center gap-1 text-sky-500 bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/20">
              Low: {formatTemp(current.tempMin, unit)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {/* Wind Speed */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Wind</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-black">{formatWindSpeed(current.windSpeed, unit)}</p>
            <p className={`text-[11px] flex items-center gap-1 mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <Compass className="w-3 h-3 text-teal-400" />
              {current.windDirection}° Dir
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-black">{current.humidity}%</p>
            <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Dew Point: {formatTemp(current.dewPoint, unit)}
            </p>
          </div>
        </div>

        {/* UV Index */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl md:text-2xl font-black">{current.uvIndex}</p>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${uvCat.color}`}>
                {uvCat.label}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (current.uvIndex / 11) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pressure */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pressure</span>
            <Gauge className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-black">{Math.round(current.pressure)} hPa</p>
            <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {current.pressure >= 1013 ? 'High Pressure' : 'Low Pressure'}
            </p>
          </div>
        </div>

        {/* Sunrise */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sunrise</span>
            <Sunrise className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-lg md:text-xl font-extrabold">{current.sunrise}</p>
            <p className="text-[11px] text-amber-500 font-semibold mt-1">Dawn</p>
          </div>
        </div>

        {/* Sunset */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sunset</span>
            <Sunset className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-lg md:text-xl font-extrabold">{current.sunset}</p>
            <p className="text-[11px] text-indigo-500 font-semibold mt-1">Dusk</p>
          </div>
        </div>
      </div>
    </div>
  );
};
