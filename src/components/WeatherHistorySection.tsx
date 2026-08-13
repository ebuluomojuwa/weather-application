import React, { useState, useEffect } from 'react';
import {
  History,
  Calendar,
  Flame,
  Snowflake,
  CloudRain,
  Wind,
  TrendingUp,
  Loader2,
  BarChart3,
  ListFilter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { LocationResult, TemperatureUnit, ThemeMode, WeatherHistorySummary } from '../types/weather';
import { fetchWeatherHistory, formatTemp, formatTempNumber, formatWindSpeed } from '../services/weatherApi';
import { getWeatherIcon } from './CurrentWeatherCard';

interface WeatherHistorySectionProps {
  location: LocationResult;
  unit: TemperatureUnit;
  themeMode?: ThemeMode;
}

export const WeatherHistorySection: React.FC<WeatherHistorySectionProps> = ({
  location,
  unit,
  themeMode = 'dark',
}) => {
  const [period, setPeriod] = useState<7 | 30>(7);
  const [historyData, setHistoryData] = useState<WeatherHistorySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'temp' | 'rain' | 'wind' | 'table'>('temp');

  const isLight = themeMode === 'light';

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const summary = await fetchWeatherHistory(location, period);
        if (isMounted) {
          setHistoryData(summary);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [location, period]);

  // Format chart data based on unit °C / °F
  const chartData = historyData
    ? historyData.dailyHistory.map((day) => ({
        date: day.dateFormatted,
        maxTemp: formatTempNumber(day.tempMax, unit),
        minTemp: formatTempNumber(day.tempMin, unit),
        meanTemp: formatTempNumber(day.tempMean, unit),
        precipitation: day.precipitationSum,
        windSpeed: day.windSpeedMax,
        label: day.conditionLabel,
        rawMax: day.tempMax,
        rawMin: day.tempMin,
      }))
    : [];

  return (
    <div
      id="weather-history-section"
      className={`w-full rounded-3xl p-6 md:p-8 shadow-2xl transition-all border backdrop-blur-2xl ${
        isLight
          ? 'bg-white/80 border-slate-200/80 text-slate-800'
          : 'bg-slate-900/60 border-slate-800/80 text-white'
      }`}
    >
      {/* Header & Period Switcher */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-bold text-sky-500 mb-2">
            <History className="w-3.5 h-3.5" />
            Historical Weather Analytics
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            Weather History for {location.name}
          </h2>
          <p className={`text-xs md:text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Compare past weather trends, temperatures, rainfall, and wind speeds over time.
          </p>
        </div>

        {/* 7 Day vs 30 Day Toggle */}
        <div className={`flex items-center p-1.5 rounded-2xl border shrink-0 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <button
            id="history-period-7d-btn"
            onClick={() => setPeriod(7)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              period === 7
                ? 'bg-sky-500 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Past 7 Days (Week)
          </button>
          <button
            id="history-period-30d-btn"
            onClick={() => setPeriod(30)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              period === 30
                ? 'bg-sky-500 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Past 30 Days (Month)
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          <p className="text-sm font-medium">Fetching historical weather archives...</p>
        </div>
      ) : !historyData ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          Unable to load history data for this location.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Avg Max/Min Temp */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                Avg Temperature
              </span>
              <div className="mt-2">
                <p className="text-2xl font-black">
                  {formatTemp(historyData.avgMaxTemp, unit)}
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Avg Low: {formatTemp(historyData.avgMinTemp, unit)}
                </p>
              </div>
            </div>

            {/* Hottest Day */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-950/40 border-amber-500/20'
            }`}>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Hottest Day
              </span>
              <div className="mt-2">
                <p className="text-2xl font-black text-amber-500">
                  {formatTemp(historyData.hottestDay.temp, unit)}
                </p>
                <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {historyData.hottestDay.date}
                </p>
              </div>
            </div>

            {/* Coldest Day */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              isLight ? 'bg-sky-50/50 border-sky-200' : 'bg-slate-950/40 border-sky-500/20'
            }`}>
              <span className="text-xs font-bold text-sky-500 uppercase tracking-wider flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                Coldest Day
              </span>
              <div className="mt-2">
                <p className="text-2xl font-black text-sky-500">
                  {formatTemp(historyData.coldestDay.temp, unit)}
                </p>
                <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {historyData.coldestDay.date}
                </p>
              </div>
            </div>

            {/* Total Rain */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-950/40 border-blue-500/20'
            }`}>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                Total Rain
              </span>
              <div className="mt-2">
                <p className="text-2xl font-black text-blue-500">
                  {historyData.totalPrecipitation} <span className="text-xs font-normal">mm</span>
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {historyData.rainyDaysCount} rainy {historyData.rainyDaysCount === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
          </div>

          {/* Visualization Tab Switcher */}
          <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className={`flex items-center gap-1 p-1 rounded-2xl border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <button
                id="history-tab-temp-btn"
                onClick={() => setActiveTab('temp')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'temp'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Temperature Trends
              </button>
              <button
                id="history-tab-rain-btn"
                onClick={() => setActiveTab('rain')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'rain'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                Precipitation
              </button>
              <button
                id="history-tab-wind-btn"
                onClick={() => setActiveTab('wind')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'wind'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                Wind Speeds
              </button>
              <button
                id="history-tab-table-btn"
                onClick={() => setActiveTab('table')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'table'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                Day-by-Day List
              </button>
            </div>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Showing {period} days of recorded archive
            </span>
          </div>

          {/* Interactive Charts */}
          {activeTab === 'temp' && (
            <div className={`border rounded-2xl p-4 md:p-6 ${
              isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                Temperature Ranges (°{unit})
              </h4>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isLight ? '#ffffff' : '#0f172a',
                        borderColor: isLight ? '#cbd5e1' : '#334155',
                        borderRadius: '12px',
                        color: isLight ? '#0f172a' : '#f8fafc',
                      }}
                      formatter={(val: any, name: any) => [
                        `${val}°${unit}`,
                        name === 'maxTemp'
                          ? 'Max Temp'
                          : name === 'minTemp'
                          ? 'Min Temp'
                          : 'Mean Temp',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="maxTemp"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#maxTempGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="minTemp"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#minTempGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'rain' && (
            <div className={`border rounded-2xl p-4 md:p-6 ${
              isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                Daily Precipitation (mm)
              </h4>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isLight ? '#ffffff' : '#0f172a',
                        borderColor: isLight ? '#cbd5e1' : '#334155',
                        borderRadius: '12px',
                        color: isLight ? '#0f172a' : '#f8fafc',
                      }}
                      formatter={(val: any) => [`${val} mm`, 'Rainfall']}
                    />
                    <Bar dataKey="precipitation" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'wind' && (
            <div className={`border rounded-2xl p-4 md:p-6 ${
              isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                Peak Daily Wind Speed (km/h)
              </h4>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isLight ? '#ffffff' : '#0f172a',
                        borderColor: isLight ? '#cbd5e1' : '#334155',
                        borderRadius: '12px',
                        color: isLight ? '#0f172a' : '#f8fafc',
                      }}
                      formatter={(val: any) => [`${val} km/h`, 'Wind Speed']}
                    />
                    <Line
                      type="monotone"
                      dataKey="windSpeed"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'table' && (
            <div className={`border rounded-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className={`font-bold uppercase tracking-wider text-[11px] border-b ${
                    isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-slate-400 border-slate-800'
                  }`}>
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Condition</th>
                      <th className="p-3.5">High / Low</th>
                      <th className="p-3.5">Rainfall</th>
                      <th className="p-3.5">Max Wind</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/80'}`}>
                    {historyData.dailyHistory.map((day) => (
                      <tr key={day.date} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'}>
                        <td className="p-3.5 font-bold">{day.dateFormatted}</td>
                        <td className="p-3.5 flex items-center gap-2">
                          <div className={`p-1 rounded border shrink-0 ${
                            isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                          }`}>
                            {getWeatherIcon(day.iconName, 'w-4 h-4')}
                          </div>
                          <span>{day.conditionLabel}</span>
                        </td>
                        <td className="p-3.5 font-bold">
                          <span className="text-rose-500">{formatTemp(day.tempMax, unit)}</span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className="text-sky-500">{formatTemp(day.tempMin, unit)}</span>
                        </td>
                        <td className="p-3.5">
                          {day.precipitationSum > 0 ? (
                            <span className="text-blue-500 font-semibold">
                              {day.precipitationSum} mm
                            </span>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>
                        <td className="p-3.5 font-semibold text-teal-500">
                          {formatWindSpeed(day.windSpeedMax, unit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
