import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudRain,
  Compass,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { CurrentWeatherData, TemperatureUnit, ThemeMode } from '../types/weather';
import {
  formatTemp,
  formatWindSpeed,
  formatPrecipitation,
  formatVisibility,
  getWindDirectionLabel,
} from '../services/weatherApi';

interface DetailedMetricsGridProps {
  current: CurrentWeatherData;
  unit: TemperatureUnit;
  themeMode?: ThemeMode;
}

export const DetailedMetricsGrid: React.FC<DetailedMetricsGridProps> = ({
  current,
  unit,
  themeMode = 'dark',
}) => {
  const isLight = themeMode === 'light';

  const cardStyle = `rounded-3xl p-5 border backdrop-blur-md transition-all hover:scale-[1.01] shadow-md flex flex-col justify-between ${
    isLight
      ? 'bg-white/80 border-slate-200/80 text-slate-800 hover:border-slate-300'
      : 'bg-slate-900/60 border-slate-800/80 text-white hover:border-slate-700/80'
  }`;

  const labelStyle = `text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
    isLight ? 'text-slate-500' : 'text-slate-400'
  }`;

  // UV level computation
  const getUvInfo = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400', bg: 'bg-orange-500' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400', bg: 'bg-rose-500' };
    return { text: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-500' };
  };

  const uvInfo = getUvInfo(current.uvIndex);

  // Pressure trend
  const pressureTrend = current.pressure > 1013 ? 'High pressure (Fair)' : 'Low pressure (Unsettled)';

  return (
    <section id="detailed-metrics-section" className="w-full mb-8 space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Gauge className="w-5 h-5 text-sky-400" />
        <h2 className={`text-xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Detailed Atmospheric Metrics
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* 1. Humidity & Dew Point */}
        <div id="card-humidity" className={cardStyle}>
          <div>
            <div className={labelStyle}>
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>Humidity & Dew Point</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black">{current.humidity}%</span>
              <span className="text-xs font-semibold opacity-75">Dew Point: {formatTemp(current.dewPoint, unit)}</span>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-800/20 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, current.humidity))}%` }}
              />
            </div>
            <p className="text-[11px] opacity-70">
              {current.humidity > 70
                ? 'High moisture, feels muggy or humid'
                : current.humidity < 30
                ? 'Dry air conditions'
                : 'Comfortable humidity level'}
            </p>
          </div>
        </div>

        {/* 2. Wind Compass & Direction */}
        <div id="card-wind" className={cardStyle}>
          <div>
            <div className={labelStyle}>
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Wind Speed & Direction</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-3xl font-black">{formatWindSpeed(current.windSpeed, unit)}</span>
                <p className="text-xs font-semibold text-teal-400">
                  {getWindDirectionLabel(current.windDirection)} ({current.windDirection}°)
                </p>
              </div>

              {/* Compass Needle Visual */}
              <div className="relative w-12 h-12 rounded-full border border-teal-500/30 flex items-center justify-center bg-teal-500/10">
                <Compass
                  className="w-8 h-8 text-teal-400 transition-transform duration-700"
                  style={{ transform: `rotate(${current.windDirection}deg)` }}
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] opacity-70">
            {current.windSpeed >= 30
              ? 'Breezy to strong winds detected'
              : 'Gentle breeze, light atmospheric drift'}
          </p>
        </div>

        {/* 3. UV Index */}
        <div id="card-uv" className={cardStyle}>
          <div>
            <div className={labelStyle}>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>UV Index Scale</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black">{current.uvIndex}</span>
              <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-full ${uvInfo.color} bg-black/10`}>
                {uvInfo.text}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-800/20 overflow-hidden">
              <div
                className={`h-full ${uvInfo.bg} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, (current.uvIndex / 12) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] opacity-70">
              {current.uvIndex >= 6 ? 'Sun protection required (SPF 30+, hat)' : 'Minimal skin protection needed'}
            </p>
          </div>
        </div>

        {/* 4. Visibility */}
        <div id="card-visibility" className={cardStyle}>
          <div>
            <div className={labelStyle}>
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Visibility Range</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black">{formatVisibility(current.visibility, unit)}</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] opacity-70">
            {current.visibility >= 10000 ? 'Clear horizon, excellent clarity' : 'Fog or haze limiting view range'}
          </p>
        </div>

        {/* 5. Pressure */}
        <div id="card-pressure" className={cardStyle}>
          <div>
            <div className={labelStyle}>
              <Gauge className="w-4 h-4 text-purple-400" />
              <span>Barometric Pressure</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black">{Math.round(current.pressure)} hPa</span>
              <span className="text-xs font-semibold text-purple-400">{pressureTrend}</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] opacity-70">
            Standard sea level pressure is 1013.25 hPa
          </p>
        </div>

        {/* 6. Sunrise & Sunset */}
        <div id="card-sun" className={cardStyle}>
          <div>
            <div className={labelStyle}>
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Sun Cycle</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <Sunrise className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase block opacity-70">Sunrise</span>
                  <span className="text-sm font-bold">{current.sunrise}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Sunset className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase block opacity-70">Sunset</span>
                  <span className="text-sm font-bold">{current.sunset}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] opacity-70">
            Natural diurnal light track
          </p>
        </div>

        {/* 7. Precipitation */}
        <div id="card-precip" className={cardStyle}>
          <div>
            <div className={labelStyle}>
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span>Precipitation & Rain</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black">{formatPrecipitation(current.precipitation, unit)}</span>
              <span className="text-xs font-bold text-blue-400">
                {current.precipitationProbability}% Chance
              </span>
            </div>
          </div>

          <p className="mt-4 text-[11px] opacity-70">
            {current.precipitation > 0 ? 'Active rain recorded' : 'No active rainfall currently'}
          </p>
        </div>

        {/* 8. Cloud Cover */}
        <div id="card-clouds" className={cardStyle}>
          <div>
            <div className={labelStyle}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cloud Density</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black">{current.cloudCover}%</span>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-800/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${current.cloudCover}%` }}
              />
            </div>
            <p className="text-[11px] opacity-70">
              {current.cloudCover > 80 ? 'Heavy cloud canopy' : current.cloudCover > 30 ? 'Scattered clouds' : 'Clear skies'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
