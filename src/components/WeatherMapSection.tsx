import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Layers, CloudRain, Cloud, Thermometer, Wind, Maximize2, RefreshCw } from 'lucide-react';
import { LocationResult, MapLayerType, TemperatureUnit, ThemeMode } from '../types/weather';
import { formatTemp } from '../services/weatherApi';

interface WeatherMapSectionProps {
  location: LocationResult;
  temperatureC: number;
  conditionLabel: string;
  unit: TemperatureUnit;
  themeMode?: ThemeMode;
}

export const WeatherMapSection: React.FC<WeatherMapSectionProps> = ({
  location,
  temperatureC,
  conditionLabel,
  unit,
  themeMode = 'dark',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const weatherTileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('rain');
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if existing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const { latitude, longitude } = location;

    // Create Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 9,
      zoomControl: false,
    });

    // Custom dark/light tile basemap
    const basemapUrl =
      themeMode === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(basemapUrl, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    // Zoom control on top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Create marker
    const customIcon = L.divIcon({
      className: 'custom-weather-pin',
      html: `
        <div style="
          background: ${themeMode === 'light' ? '#0f172a' : '#0284c7'};
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid white;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <span>📍 ${location.name}</span>
          <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 10px;">
            ${formatTemp(temperatureC, unit)}
          </span>
        </div>
      `,
      iconSize: [120, 36],
      iconAnchor: [60, 18],
    });

    const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <div style="padding: 4px; color: #1e293b;">
        <h3 style="font-weight:700; font-size:14px; margin:0 0 2px 0;">${location.name}</h3>
        <p style="margin:0; font-size:12px; color:#64748b;">${conditionLabel} • ${formatTemp(temperatureC, unit)}</p>
      </div>
    `);

    markerRef.current = marker;
    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.latitude, location.longitude, themeMode]);

  // Update Weather Overlay Tiles based on activeLayer
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (weatherTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(weatherTileLayerRef.current);
      weatherTileLayerRef.current = null;
    }

    let tileUrl = '';
    let opacity = 0.65;

    // OpenWeather / RainViewer public radar tile overlays
    switch (activeLayer) {
      case 'rain':
        // RainViewer radar precipitation layer
        tileUrl = 'https://tile.rainviewer.com/v2/radar/nowcast/256/{z}/{x}/{y}/2/1_1.png';
        opacity = 0.7;
        break;
      case 'clouds':
        // Open-Meteo or OpenWeather cloud tile placeholder layer
        tileUrl = 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=c41498b335a7a8d5f3d434d2629b0a70';
        opacity = 0.6;
        break;
      case 'temp':
        tileUrl = 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=c41498b335a7a8d5f3d434d2629b0a70';
        opacity = 0.55;
        break;
      case 'wind':
        tileUrl = 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=c41498b335a7a8d5f3d434d2629b0a70';
        opacity = 0.6;
        break;
    }

    if (tileUrl) {
      const layer = L.tileLayer(tileUrl, {
        opacity,
        maxZoom: 18,
        attribution: '&copy; RainViewer / OpenWeather',
      });
      layer.addTo(mapInstanceRef.current);
      weatherTileLayerRef.current = layer;
    }
  }, [activeLayer, isMapReady]);

  // Recenter map button
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 9, {
        animate: true,
      });
    }
  };

  const isLight = themeMode === 'light';

  return (
    <section id="weather-map-section" className="w-full mb-8 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <h2 className={`text-xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Interactive Weather Radar & Satellite Map
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="recenter-map-btn"
            onClick={handleRecenter}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/80'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>Center on {location.name}</span>
          </button>
        </div>
      </div>

      {/* Map Card */}
      <div
        className={`relative rounded-3xl border overflow-hidden shadow-xl transition-all ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        {/* Layer Selection Floating Controls */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-lg">
          <button
            id="map-layer-rain-btn"
            onClick={() => setActiveLayer('rain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLayer === 'rain'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>

          <button
            id="map-layer-clouds-btn"
            onClick={() => setActiveLayer('clouds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLayer === 'clouds'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Clouds</span>
          </button>

          <button
            id="map-layer-temp-btn"
            onClick={() => setActiveLayer('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLayer === 'temp'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>

          <button
            id="map-layer-wind-btn"
            onClick={() => setActiveLayer('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLayer === 'wind'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Speed</span>
          </button>
        </div>

        {/* Map Canvas */}
        <div
          id="leaflet-weather-map-container"
          ref={mapContainerRef}
          className="w-full h-[360px] md:h-[420px] z-0"
        />

        {/* Legend Footer */}
        <div
          className={`p-3 border-t flex flex-wrap items-center justify-between text-xs gap-2 ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sky-400 uppercase tracking-wider text-[10px]">Active Layer:</span>
            <span className="font-bold uppercase">{activeLayer} Overlay</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Light
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Heavy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
