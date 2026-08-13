import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  LocationResult,
  TemperatureUnit,
  WeatherSimulationType,
  CompleteWeatherResponse,
  ThemeMode,
} from './types/weather';
import {
  fetchWeatherData,
  DEFAULT_LOCATIONS,
  reverseGeocode,
} from './services/weatherApi';
import { Header } from './components/Header';
import { WeatherCanvasSimulation } from './components/WeatherCanvasSimulation';
import { WeatherAlertsBanner } from './components/WeatherAlertsBanner';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMapSection } from './components/WeatherMapSection';
import { DetailedMetricsGrid } from './components/DetailedMetricsGrid';
import { WeatherHistorySection } from './components/WeatherHistorySection';
import { SimulationControlsModal } from './components/SimulationControlsModal';
import { SavedLocationsBar } from './components/SavedLocationsBar';

export default function App() {
  // Location & Weather Data
  const [currentLocation, setCurrentLocation] = useState<LocationResult>(DEFAULT_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<CompleteWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingGps, setIsLoadingGps] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // User Preferences
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem('weather_unit');
    return (saved as TemperatureUnit) || 'C';
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('weather_theme_mode');
    return (saved as ThemeMode) || 'dark';
  });

  const [favorites, setFavorites] = useState<LocationResult[]>(() => {
    const saved = localStorage.getItem('weather_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [DEFAULT_LOCATIONS[0], DEFAULT_LOCATIONS[1], DEFAULT_LOCATIONS[2]];
  });

  // Simulation State
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [customSimulation, setCustomSimulation] = useState<WeatherSimulationType | null>(null);
  const [simulationNight, setSimulationNight] = useState<boolean>(false);
  const [simulationIntensity, setSimulationIntensity] = useState<number>(1.0);

  // Save Preferences
  useEffect(() => {
    localStorage.setItem('weather_unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('weather_theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch Weather Data
  const loadWeather = useCallback(async (location: LocationResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
      setCurrentLocation(location);
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(err.message || 'Unable to retrieve weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(currentLocation);
  }, []);

  // Handle GPS Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          await loadWeather(loc);
        } catch (err) {
          console.error('GPS reverse geocode error:', err);
          await loadWeather({
            id: Date.now(),
            name: 'My Location',
            latitude,
            longitude,
          });
        } finally {
          setIsLoadingGps(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLoadingGps(false);
        alert('Could not access your device location. Please search for a city above.');
      },
      { timeout: 10000 }
    );
  };

  // Favorite Location Toggle
  const handleToggleFavorite = (loc: LocationResult) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.id === loc.id || (f.latitude === loc.latitude && f.longitude === loc.longitude)
      );
      if (exists) {
        return prev.filter(
          (f) => !(f.id === loc.id || (f.latitude === loc.latitude && f.longitude === loc.longitude))
        );
      }
      return [...prev, loc];
    });
  };

  // Determine active simulation and background
  const liveSimulationType: WeatherSimulationType = weatherData
    ? weatherData.current.condition.simulationType
    : 'sunny';

  const isNightTime = weatherData ? !weatherData.current.isDay : false;

  const activeSimulation: WeatherSimulationType = customSimulation || liveSimulationType;
  const isNight: boolean = customSimulation !== null ? simulationNight : isNightTime;

  // Background Gradient
  const isLight = themeMode === 'light';

  const activeBgGradient = customSimulation
    ? simulationNight
      ? 'from-slate-950 via-slate-900 to-indigo-950'
      : isLight
      ? 'from-sky-100 via-blue-50 to-indigo-100'
      : 'from-blue-600 via-sky-500 to-indigo-900'
    : weatherData
    ? isLight
      ? isNightTime
        ? weatherData.current.condition.bgGradient.lightNight
        : weatherData.current.condition.bgGradient.lightDay
      : isNightTime
      ? weatherData.current.condition.bgGradient.night
      : weatherData.current.condition.bgGradient.day
    : isLight
    ? 'from-slate-100 via-blue-50 to-sky-100'
    : 'from-slate-900 via-blue-950 to-slate-950';

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${activeBgGradient} ${
        isLight ? 'text-slate-900' : 'text-slate-100'
      } font-sans transition-all duration-700 relative selection:bg-sky-400 selection:text-slate-950`}
    >
      {/* Live Canvas Particle Weather Simulation */}
      <WeatherCanvasSimulation
        simulationType={activeSimulation}
        isNight={isNight}
        intensity={simulationIntensity}
      />

      {/* Main Container */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header Navigation */}
        <Header
          currentLocation={currentLocation}
          onSelectLocation={loadWeather}
          unit={unit}
          onToggleUnit={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
          themeMode={themeMode}
          onToggleTheme={() => setThemeMode((m) => (m === 'dark' ? 'light' : 'dark'))}
          onOpenSimulationModal={() => setIsSimulationModalOpen(true)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          isLoadingLocation={isLoadingGps}
          onUseCurrentLocation={handleUseCurrentLocation}
        />

        {/* Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:px-8 space-y-8">
          {/* Saved Locations Bar */}
          <SavedLocationsBar
            favorites={favorites}
            currentLocation={currentLocation}
            onSelectLocation={loadWeather}
            onRemoveFavorite={handleToggleFavorite}
            themeMode={themeMode}
          />

          {/* Weather Alerts Banner (Feature 6) */}
          {weatherData?.alerts && weatherData.alerts.length > 0 && (
            <WeatherAlertsBanner alerts={weatherData.alerts} themeMode={themeMode} />
          )}

          {/* Error Message */}
          {error && (
            <div className="p-6 rounded-3xl bg-rose-900/80 border border-rose-500/40 text-rose-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
              <button
                id="retry-fetch-btn"
                onClick={() => loadWeather(currentLocation)}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs border border-rose-400/30 transition-all flex items-center gap-2 shrink-0 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
              <div className={`p-4 rounded-3xl backdrop-blur-2xl border shadow-2xl animate-bounce ${
                isLight ? 'bg-white/80 border-slate-300' : 'bg-white/10 border-white/20'
              }`}>
                <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
              </div>
              <div>
                <h3 className={`text-xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Fetching Weather Data
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Retrieving real-time forecasts for {currentLocation.name}...
                </p>
              </div>
            </div>
          ) : weatherData ? (
            <>
              {/* Feature 2: Current Weather Dashboard */}
              <CurrentWeatherCard
                current={weatherData.current}
                location={currentLocation}
                unit={unit}
                activeSimulation={activeSimulation}
                isCustomSimulation={customSimulation !== null}
                onResetSimulation={() => setCustomSimulation(null)}
                themeMode={themeMode}
              />

              {/* Feature 3: 24-Hour Forecast & Temp Chart */}
              <HourlyForecast
                hourly={weatherData.hourly}
                unit={unit}
                themeMode={themeMode}
              />

              {/* Feature 4: 10-Day Extended Forecast */}
              <DailyForecast
                daily={weatherData.daily}
                unit={unit}
                themeMode={themeMode}
              />

              {/* Feature 7: Interactive Weather Map (Leaflet with Radar overlays) */}
              <WeatherMapSection
                location={currentLocation}
                temperatureC={weatherData.current.temperature}
                conditionLabel={weatherData.current.condition.label}
                unit={unit}
                themeMode={themeMode}
              />

              {/* Feature 5: Detailed Atmospheric Metrics Cards */}
              <DetailedMetricsGrid
                current={weatherData.current}
                unit={unit}
                themeMode={themeMode}
              />

              {/* Feature 8 & History: Weather History Section (Week/Month Archives & Charts) */}
              <WeatherHistorySection
                location={currentLocation}
                unit={unit}
                themeMode={themeMode}
              />
            </>
          ) : null}
        </main>

        {/* Footer */}
        <footer className={`w-full border-t py-6 px-4 text-center text-xs backdrop-blur-md ${
          isLight
            ? 'bg-white/60 border-slate-200 text-slate-600'
            : 'bg-slate-950/60 border-slate-800 text-slate-400'
        }`}>
          <p>
            Weather Tracker App • Real-time Meteorological Forecasts, Severe Alerts & Archives
          </p>
        </footer>
      </div>

      {/* Weather Simulation Modal */}
      <SimulationControlsModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        activeSimulation={activeSimulation}
        onSelectSimulation={(type) => {
          setCustomSimulation(type);
        }}
        isNightSimulation={simulationNight}
        onToggleNightSimulation={() => setSimulationNight((prev) => !prev)}
        intensity={simulationIntensity}
        onChangeIntensity={setSimulationIntensity}
        isCustomSimulation={customSimulation !== null}
        onResetToLive={() => setCustomSimulation(null)}
      />
    </div>
  );
}
