import React from 'react';
import { Calendar, Droplets, Wind, Sun } from 'lucide-react';
import { DailyDataPoint, TemperatureUnit, ThemeMode } from '../types/weather';
import { formatTemp, formatWindSpeed } from '../services/weatherApi';
import { getWeatherIcon } from './CurrentWeatherCard';

interface DailyForecastProps {
  daily: DailyDataPoint[];
  unit: TemperatureUnit;
  themeMode?: ThemeMode;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit, themeMode = 'dark' }) => {
  if (!daily || daily.length === 0) return null;

  const isLight = themeMode === 'light';

  // Find overall min and max across all days for visual range bar scaling
  const minTempAll = Math.min(...daily.map((d) => d.tempMin));
  const maxTempAll = Math.max(...daily.map((d) => d.tempMax));
  const tempSpan = Math.max(1, maxTempAll - minTempAll);

  return (
    <div
      id="daily-forecast-container"
      className={`w-full rounded-3xl p-6 border backdrop-blur-2xl transition-all shadow-xl ${
        isLight
          ? 'bg-white/80 border-slate-200/80 text-slate-800'
          : 'bg-slate-900/60 border-slate-800/80 text-white'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          10-Day Extended Forecast
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800/80 text-slate-300 border-slate-700'
        }`}>
          10 Days Outlook
        </span>
      </div>

      <div className="space-y-2.5">
        {daily.map((day, idx) => {
          // Calculate range percentage for mini temp bar
          const leftPercent = ((day.tempMin - minTempAll) / tempSpan) * 100;
          const widthPercent = Math.max(10, ((day.tempMax - day.tempMin) / tempSpan) * 100);

          return (
            <div
              key={day.date}
              id={`daily-item-${idx}`}
              className={`p-3.5 md:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                idx === 0
                  ? isLight
                    ? 'bg-sky-50 border-sky-200 shadow-sm'
                    : 'bg-sky-500/10 border-sky-500/30 shadow-md'
                  : isLight
                  ? 'bg-white border-slate-200/60 hover:bg-slate-50'
                  : 'bg-slate-950/40 border-slate-800/60 hover:bg-white/5'
              }`}
            >
              {/* Day & Condition */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className={`p-2 rounded-xl border shrink-0 ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/60 border-slate-700/60'
                }`}>
                  {getWeatherIcon(day.iconName, 'w-6 h-6')}
                </div>
                <div>
                  <p className="text-sm font-bold flex items-center gap-2">
                    {day.dayName}
                    {idx === 0 && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500 text-white">
                        Today
                      </span>
                    )}
                  </p>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{day.conditionLabel}</p>
                </div>
              </div>

              {/* Rain & Wind indicators */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1 text-sky-400 min-w-[60px]" title="Precipitation Probability">
                  <Droplets className="w-3.5 h-3.5" />
                  {day.precipitationProbabilityMax}%
                </span>
                <span className={`flex items-center gap-1 min-w-[75px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`} title="Max Wind Speed">
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                  {formatWindSpeed(day.windSpeedMax, unit)}
                </span>
                <span className={`hidden md:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  day.uvIndexMax >= 8
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : day.uvIndexMax >= 5
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`} title="UV Index Max">
                  <Sun className="w-3 h-3" />
                  UV {day.uvIndexMax}
                </span>
              </div>

              {/* Min - Bar - Max Temperature Visual */}
              <div className="flex items-center gap-3 min-w-[210px] justify-end">
                <span className="text-xs font-bold text-sky-400 w-12 text-right">
                  {formatTemp(day.tempMin, unit)}
                </span>

                {/* Visual Range Bar */}
                <div className={`w-28 md:w-36 h-2 rounded-full relative overflow-hidden border ${
                  isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-rose-400 w-12 text-left">
                  {formatTemp(day.tempMax, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
