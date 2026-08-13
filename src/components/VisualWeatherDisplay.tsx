import React, { useState } from 'react';
import {
  Sun,
  CloudRain,
  Sparkles,
  Sliders,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudLightning,
  Flame,
} from 'lucide-react';
import { CurrentWeatherData, ThemeMode, WeatherSimulationType } from '../types/weather';
import rainImg from '../assets/images/heavy_rain_pouring_1786645742420.jpg';
import sunImg from '../assets/images/bright_moving_sun_1786645755450.jpg';

interface VisualWeatherDisplayProps {
  current: CurrentWeatherData;
  activeSimulation: WeatherSimulationType;
  themeMode?: ThemeMode;
}

export type VisualModeOption = 'auto' | 'rain' | 'sun' | 'minimized';

export const VisualWeatherDisplay: React.FC<VisualWeatherDisplayProps> = ({
  current,
  activeSimulation,
  themeMode = 'dark',
}) => {
  const [selectedOption, setSelectedOption] = useState<VisualModeOption>('auto');
  const [isAnimationPaused, setIsAnimationPaused] = useState<boolean>(false);
  const [rainSpeed, setRainSpeed] = useState<'normal' | 'torrential'>('torrential');
  const [sunMotionSpeed, setSunMotionSpeed] = useState<'gentle' | 'dynamic'>('gentle');

  const isLight = themeMode === 'light';

  // Determine active display mode
  const isRainyCondition =
    activeSimulation === 'rainy' ||
    activeSimulation === 'heavy_rain' ||
    activeSimulation === 'thunderstorm' ||
    current.condition.simulationType === 'rainy' ||
    current.condition.simulationType === 'heavy_rain' ||
    current.condition.simulationType === 'thunderstorm';

  const effectiveDisplayMode: 'rain' | 'sun' | 'minimized' =
    selectedOption === 'minimized'
      ? 'minimized'
      : selectedOption === 'rain'
      ? 'rain'
      : selectedOption === 'sun'
      ? 'sun'
      : isRainyCondition
      ? 'rain'
      : 'sun';

  if (effectiveDisplayMode === 'minimized') {
    return (
      <div
        id="visual-weather-display-minimized"
        className={`w-full rounded-2xl p-4 border transition-all flex items-center justify-between mb-8 ${
          isLight ? 'bg-slate-100/90 border-slate-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Interactive Weather Visual Display Option</p>
            <p className="text-xs text-slate-400">Pouring rain downpour & moving sun visual options are collapsed.</p>
          </div>
        </div>
        <button
          id="restore-visual-display-btn"
          onClick={() => setSelectedOption('auto')}
          className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-400 transition-all flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          Show Weather Visuals
        </button>
      </div>
    );
  }

  return (
    <div
      id="visual-weather-display-container"
      className={`relative w-full rounded-3xl overflow-hidden border shadow-2xl transition-all mb-8 ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/80 border-slate-800'
      }`}
    >
      {/* Header Bar with Mode Option Switcher */}
      <div className={`p-4 md:px-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${
            effectiveDisplayMode === 'rain'
              ? 'bg-sky-500/20 text-sky-400'
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            {effectiveDisplayMode === 'rain' ? (
              <CloudRain className="w-5 h-5 animate-bounce" />
            ) : (
              <Sun className="w-5 h-5 animate-spin-slow" />
            )}
          </div>
          <div>
            <h3 className="text-sm md:text-base font-extrabold flex items-center gap-2">
              <span>Weather Display:</span>
              <span className={effectiveDisplayMode === 'rain' ? 'text-sky-400' : 'text-amber-400'}>
                {effectiveDisplayMode === 'rain' ? 'Pouring Rain Scene' : 'Moving Sun Scene'}
              </span>
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {effectiveDisplayMode === 'rain'
                ? 'High-definition image of rain pouring with streaming water droplets'
                : 'High-definition image of bright sun with continuous movement animation'}
            </p>
          </div>
        </div>

        {/* Option Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            id="visual-option-auto-btn"
            onClick={() => setSelectedOption('auto')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedOption === 'auto'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Automatically match current weather"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto
          </button>

          <button
            id="visual-option-rain-btn"
            onClick={() => setSelectedOption('rain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedOption === 'rain'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Show Pouring Rain visual"
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-300" />
            Pouring Rain
          </button>

          <button
            id="visual-option-sun-btn"
            onClick={() => setSelectedOption('sun')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedOption === 'sun'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Show Moving Sun visual"
          >
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            Moving Sun
          </button>

          <button
            id="visual-option-minimize-btn"
            onClick={() => setSelectedOption('minimized')}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 transition-all ml-1"
            title="Minimize visual frame"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Visual Display Frame */}
      <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden bg-slate-950 group">
        {/* ===================== 1. POURING RAIN DISPLAY ===================== */}
        {effectiveDisplayMode === 'rain' && (
          <div className="relative w-full h-full overflow-hidden">
            {/* Background Image of Rain Pouring */}
            <img
              src={rainImg}
              alt="Heavy Pouring Rain Weather"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                isAnimationPaused ? 'scale-100' : 'scale-105 animate-pulse-slow'
              }`}
            />

            {/* Dark Atmospheric Rain Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-sky-950/30" />

            {/* Animated Pouring Rain Streams & Droplets */}
            {!isAnimationPaused && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Continuous Pouring Lines Layer 1 */}
                <div
                  className={`absolute inset-0 bg-repeat-y opacity-70 ${
                    rainSpeed === 'torrential' ? 'animate-rain-fast' : 'animate-rain-normal'
                  }`}
                  style={{
                    backgroundImage:
                      'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(186, 230, 253, 0.6) 50%, rgba(255, 255, 255, 0) 100%)',
                    backgroundSize: '2px 80px',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                  }}
                />

                {/* Heavy Pouring Lines Layer 2 (Slanted) */}
                <div
                  className={`absolute -inset-[20%] bg-repeat opacity-50 ${
                    rainSpeed === 'torrential' ? 'animate-rain-heavy-slant' : 'animate-rain-slant'
                  }`}
                  style={{
                    backgroundImage:
                      'radial-gradient(1px 25px at 20px 30px, rgba(255,255,255,0.8), transparent), radial-gradient(1.5px 35px at 60px 80px, rgba(186,230,253,0.9), transparent)',
                    backgroundSize: '100px 120px',
                  }}
                />

                {/* Water Splash Splatters on Viewport Glass */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-sky-400/20 to-transparent backdrop-blur-[1px] animate-pulse" />
              </div>
            )}

            {/* Information & Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 z-20">
              <div className="bg-slate-950/80 backdrop-blur-xl border border-sky-500/30 p-4 rounded-2xl max-w-lg shadow-2xl">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <CloudLightning className="w-4 h-4 animate-bounce" />
                  <span>Heavy Pouring Rain Active</span>
                </div>
                <h4 className="text-lg md:text-xl font-black text-white">
                  Intense Downpour Scene
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Visualizing torrent rain precipitation with animated cascading raindrops streaming across the atmosphere.
                </p>
              </div>

              {/* Rain Controls */}
              <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-700 shadow-xl">
                <button
                  id="rain-speed-toggle-btn"
                  onClick={() => setRainSpeed((s) => (s === 'torrential' ? 'normal' : 'torrential'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    rainSpeed === 'torrential'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Rain: {rainSpeed === 'torrential' ? 'Torrential' : 'Moderate'}
                </button>

                <button
                  id="rain-pause-animation-btn"
                  onClick={() => setIsAnimationPaused((p) => !p)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                  title={isAnimationPaused ? 'Play rain animation' : 'Pause rain animation'}
                >
                  {isAnimationPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== 2. MOVING SUN DISPLAY ===================== */}
        {effectiveDisplayMode === 'sun' && (
          <div className="relative w-full h-full overflow-hidden">
            {/* Moving Sun Background Image Container with Orbital Movement */}
            <div
              className={`absolute inset-0 w-[115%] h-[115%] -top-[7.5%] -left-[7.5%] transition-all ${
                isAnimationPaused
                  ? ''
                  : sunMotionSpeed === 'dynamic'
                  ? 'animate-sun-move-fast'
                  : 'animate-sun-move-gentle'
              }`}
            >
              <img
                src={sunImg}
                alt="Moving Sun Weather"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Radiant Sun Lens Flare & Rays Animation Layer */}
            {!isAnimationPaused && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Rotating Solar Flare Wheel */}
                <div
                  className="absolute -top-20 right-10 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full animate-spin-ultra-slow opacity-60"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.15) 30deg, transparent 60deg, rgba(255,165,0,0.2) 120deg, transparent 180deg, rgba(255,235,150,0.25) 240deg, transparent 300deg)',
                  }}
                />

                {/* Pulsing Sun Core Glow */}
                <div
                  className="absolute top-12 right-24 w-40 h-40 rounded-full bg-amber-400/20 blur-2xl animate-pulse"
                />

                {/* Moving Sunlight Sweep Beam */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/10 to-amber-100/20 animate-sun-beam"
                />
              </div>
            )}

            {/* Dark Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

            {/* Information & Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 z-20">
              <div className="bg-slate-950/80 backdrop-blur-xl border border-amber-500/30 p-4 rounded-2xl max-w-lg shadow-2xl">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sun className="w-4 h-4 animate-spin-slow" />
                  <span>Moving Sun Active</span>
                </div>
                <h4 className="text-lg md:text-xl font-black text-white">
                  Dynamic Solar Movement Scene
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Visualizing radiant moving sunlight with continuous orbital motion trajectory and solar flare rays.
                </p>
              </div>

              {/* Sun Motion Controls */}
              <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-700 shadow-xl">
                <button
                  id="sun-speed-toggle-btn"
                  onClick={() => setSunMotionSpeed((s) => (s === 'gentle' ? 'dynamic' : 'gentle'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    sunMotionSpeed === 'dynamic'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Motion: {sunMotionSpeed === 'dynamic' ? 'Dynamic' : 'Gentle Orbit'}
                </button>

                <button
                  id="sun-pause-animation-btn"
                  onClick={() => setIsAnimationPaused((p) => !p)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                  title={isAnimationPaused ? 'Play sun motion' : 'Pause sun motion'}
                >
                  {isAnimationPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
