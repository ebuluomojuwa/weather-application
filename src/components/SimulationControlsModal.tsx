import React from 'react';
import {
  X,
  Sparkles,
  Sun,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  Flame,
  Moon,
  RotateCcw,
  Sliders,
  Check,
} from 'lucide-react';
import { WeatherSimulationType } from '../types/weather';

interface SimulationControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSimulation: WeatherSimulationType;
  onSelectSimulation: (sim: WeatherSimulationType) => void;
  isNightSimulation: boolean;
  onToggleNightSimulation: () => void;
  intensity: number;
  onChangeIntensity: (val: number) => void;
  isCustomSimulation: boolean;
  onResetToLive: () => void;
}

interface SimulationOption {
  type: WeatherSimulationType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

export const SimulationControlsModal: React.FC<SimulationControlsModalProps> = ({
  isOpen,
  onClose,
  activeSimulation,
  onSelectSimulation,
  isNightSimulation,
  onToggleNightSimulation,
  intensity,
  onChangeIntensity,
  isCustomSimulation,
  onResetToLive,
}) => {
  if (!isOpen) return null;

  const options: SimulationOption[] = [
    {
      type: 'sunny',
      title: 'Sunny Clear Sky',
      description: 'Golden solar flares, bright ray rotation & shimmering dust motes.',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      gradient: 'from-amber-500/20 to-orange-500/20 border-amber-500/40',
    },
    {
      type: 'rainy',
      title: 'Rainy Drizzle',
      description: 'Translucent falling rain drops with floor splash ripples.',
      icon: <CloudRain className="w-5 h-5 text-cyan-400" />,
      gradient: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/40',
    },
    {
      type: 'heavy_rain',
      title: 'Heavy Downpour',
      description: 'Dense angled rain particles with intense surface splashes.',
      icon: <CloudRain className="w-5 h-5 text-blue-400" />,
      gradient: 'from-blue-600/20 to-indigo-600/20 border-blue-500/40',
    },
    {
      type: 'thunderstorm',
      title: 'Electric Thunderstorm',
      description: 'Stormy downpour with periodic lightning sheet flashes.',
      icon: <CloudLightning className="w-5 h-5 text-amber-300" />,
      gradient: 'from-purple-600/20 to-slate-800/20 border-purple-500/40',
    },
    {
      type: 'snowy',
      title: 'Gentle Snowfall',
      description: 'Soft swirling snowflakes with sine-wave physics wobble.',
      icon: <Snowflake className="w-5 h-5 text-cyan-200" />,
      gradient: 'from-cyan-500/20 to-sky-500/20 border-cyan-400/40',
    },
    {
      type: 'blizzard',
      title: 'Heavy Blizzard',
      description: 'Dense windswept snow flurries and frosty atmosphere.',
      icon: <Snowflake className="w-5 h-5 text-slate-100 animate-spin-slow" />,
      gradient: 'from-slate-400/20 to-blue-600/20 border-slate-300/40',
    },
    {
      type: 'foggy',
      title: 'Foggy Mist',
      description: 'Rolling horizontal misty vapor clouds across the screen.',
      icon: <CloudFog className="w-5 h-5 text-slate-300" />,
      gradient: 'from-slate-500/20 to-zinc-600/20 border-slate-400/40',
    },
    {
      type: 'extreme_hot',
      title: 'Extreme Heatwave (>38°C)',
      description: 'Intense heat shimmer distortion, radial glow & rising heat particles.',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      gradient: 'from-rose-600/20 to-amber-600/20 border-rose-500/40',
    },
    {
      type: 'extreme_cold',
      title: 'Freezing Cold (-10°C)',
      description: 'Icy glimmers, freezing temperature tint & crystal frost overlays.',
      icon: <Snowflake className="w-5 h-5 text-cyan-300" />,
      gradient: 'from-cyan-600/20 to-blue-900/20 border-cyan-400/40',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Atmospheric Simulator</h3>
              <p className="text-xs text-slate-300">
                Test and simulate different weather states & particle physics live.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-6 space-y-6 pr-1">
          {/* Night / Day Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Night Atmosphere</p>
                <p className="text-xs text-slate-400">Toggle dark night sky lighting for the simulation</p>
              </div>
            </div>
            <button
              onClick={onToggleNightSimulation}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                isNightSimulation ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isNightSimulation ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Intensity Slider */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Particle Density & Intensity
              </span>
              <span className="text-cyan-400">{Math.round(intensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={intensity}
              onChange={(e) => onChangeIntensity(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Grid Options */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Weather State to Simulate
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => {
                const isSelected = activeSimulation === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => onSelectSimulation(opt.type)}
                    className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between gap-2 ${
                      isSelected
                        ? `bg-gradient-to-r ${opt.gradient} ring-2 ring-cyan-400 shadow-xl`
                        : 'bg-slate-950/40 border-white/10 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                          {opt.icon}
                        </div>
                        <span className="text-sm font-bold text-white">{opt.title}</span>
                      </div>
                      {isSelected && (
                        <span className="p-1 rounded-full bg-cyan-400 text-slate-950 font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          {isCustomSimulation ? (
            <button
              onClick={onResetToLive}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-white/15"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              Reset to Live Weather
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Currently showing live weather simulation</span>
          )}

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
