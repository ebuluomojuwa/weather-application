import React, { useState } from 'react';
import { Clock, Droplets, Wind, LineChart, LayoutGrid } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { HourlyDataPoint, TemperatureUnit, ThemeMode } from '../types/weather';
import { formatTemp, formatTempNumber, formatWindSpeed } from '../services/weatherApi';
import { getWeatherIcon } from './CurrentWeatherCard';

interface HourlyForecastProps {
  hourly: HourlyDataPoint[];
  unit: TemperatureUnit;
  themeMode?: ThemeMode;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit, themeMode = 'dark' }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards');

  if (!hourly || hourly.length === 0) return null;

  const isLight = themeMode === 'light';

  // Format chart data
  const chartData = hourly.map((item, idx) => ({
    time: idx === 0 ? 'Now' : item.time,
    temp: formatTempNumber(item.temp, unit),
    pop: item.pop,
    condition: item.conditionLabel,
  }));

  return (
    <div
      id="hourly-forecast-container"
      className={`w-full rounded-3xl p-6 border backdrop-blur-2xl transition-all shadow-xl ${
        isLight
          ? 'bg-white/80 border-slate-200/80 text-slate-800'
          : 'bg-slate-900/60 border-slate-800/80 text-white'
      }`}
    >
      {/* Header with View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <h3 className="text-xl font-extrabold tracking-tight">24-Hour Forecast & Hourly Temperature Chart</h3>
        </div>

        <div className={`flex items-center gap-1 p-1 rounded-xl border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <button
            id="hourly-view-cards-btn"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-sky-500 text-white shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Horizontal Cards</span>
          </button>

          <button
            id="hourly-view-chart-btn"
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'chart'
                ? 'bg-sky-500 text-white shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Temperature Chart</span>
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-sky-500/20 scrollbar-track-transparent">
          {hourly.map((item, idx) => (
            <div
              key={idx}
              id={`hourly-item-${idx}`}
              className={`min-w-[105px] flex-1 p-3.5 rounded-2xl flex flex-col items-center justify-between gap-3 border transition-all duration-300 ${
                idx === 0
                  ? 'bg-sky-500/20 border-sky-400/50 shadow-md shadow-sky-500/10'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-white/5'
              }`}
            >
              <span className={`text-xs font-bold whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {idx === 0 ? 'Now' : item.time}
              </span>

              <div className={`p-2 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-800/60 border-slate-700/60'
              }`}>
                {getWeatherIcon(item.iconName, 'w-6 h-6')}
              </div>

              <span className="text-lg font-black">
                {formatTemp(item.temp, unit)}
              </span>

              <div className={`flex flex-col items-center gap-1 w-full pt-2 border-t text-[11px] font-semibold ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                {item.pop > 0 ? (
                  <span className="text-sky-400 flex items-center gap-0.5">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    {item.pop}%
                  </span>
                ) : (
                  <span className="opacity-40">0% Rain</span>
                )}

                <span className={`flex items-center gap-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Wind className="w-3 h-3 text-teal-400" />
                  {formatWindSpeed(item.windSpeed, unit)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Temperature Chart View */
        <div className="w-full h-[240px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isLight ? '#e2e8f0' : '#1e293b'}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit={`°${unit}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isLight ? '#ffffff' : '#0f172a',
                  borderColor: isLight ? '#cbd5e1' : '#334155',
                  borderRadius: '12px',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any) => [`${value}°${unit}`, 'Temperature']}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
