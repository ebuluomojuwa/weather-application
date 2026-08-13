import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  Bookmark,
  Thermometer,
  X,
  Compass,
  Loader2,
  Sun,
  Moon,
  Clock,
  Trash2,
} from 'lucide-react';
import { LocationResult, TemperatureUnit, ThemeMode } from '../types/weather';
import { searchLocations, DEFAULT_LOCATIONS } from '../services/weatherApi';

interface HeaderProps {
  currentLocation: LocationResult | null;
  onSelectLocation: (loc: LocationResult) => void;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onOpenSimulationModal: () => void;
  favorites: LocationResult[];
  onToggleFavorite: (loc: LocationResult) => void;
  isLoadingLocation: boolean;
  onUseCurrentLocation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  unit,
  onToggleUnit,
  themeMode,
  onToggleTheme,
  onOpenSimulationModal,
  favorites,
  onToggleFavorite,
  isLoadingLocation,
  onUseCurrentLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationResult[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLight = themeMode === 'light';

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather_tracker_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load recent searches', e);
    }
  }, []);

  // Save selected location to recent searches
  const handleLocationSelected = (loc: LocationResult) => {
    onSelectLocation(loc);
    setIsDropdownOpen(false);
    setSearchQuery('');

    // Save to recent searches array (keep top 5)
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.id !== loc.id && !(item.latitude === loc.latitude && item.longitude === loc.longitude)
      );
      const updated = [loc, ...filtered].slice(0, 5);
      localStorage.setItem('weather_tracker_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('weather_tracker_recent_searches');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isCurrentFavorite = currentLocation
    ? favorites.some((f) => f.id === currentLocation.id || (f.latitude === currentLocation.latitude && f.longitude === currentLocation.longitude))
    : false;

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b px-4 py-3 md:px-8 shadow-md transition-colors duration-300 ${
        isLight
          ? 'bg-white/80 border-slate-200 text-slate-800'
          : 'bg-slate-900/70 border-slate-800 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Current Location Label */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 shadow-md shadow-sky-500/20 text-white flex items-center justify-center">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                Weather<span className="text-sky-500">Tracker</span>
              </h1>
              {currentLocation && (
                <p className={`text-xs font-medium flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {currentLocation.name}
                  {currentLocation.admin1 ? `, ${currentLocation.admin1}` : ''}
                  {currentLocation.country ? `, ${currentLocation.country}` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {currentLocation && (
              <button
                id="save-favorite-mobile-btn"
                onClick={() => onToggleFavorite(currentLocation)}
                className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                  isCurrentFavorite
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-md'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title={isCurrentFavorite ? 'Saved in Favorites' : 'Save Location'}
              >
                <Bookmark className={`w-4 h-4 ${isCurrentFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>
            )}
            <button
              id="theme-toggle-mobile-btn"
              onClick={onToggleTheme}
              className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center ${
                isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
              title="Toggle Theme Mode"
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              id="unit-toggle-mobile-btn"
              onClick={onToggleUnit}
              className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                isLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-800 text-white border-slate-700'
              }`}
              title="Toggle Temperature Unit"
            >
              °{unit}
            </button>
            <button
              id="open-simulation-mobile-btn"
              onClick={onOpenSimulationModal}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-500 text-xs font-medium backdrop-blur-md transition-all flex items-center justify-center"
              title="Simulate Weather"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Location Search Bar */}
        <div className="relative w-full md:max-w-md" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className={`absolute left-3.5 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              id="location-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search city, state, or country..."
              className={`w-full text-sm rounded-2xl pl-10 pr-24 py-2.5 border focus:outline-none focus:ring-2 transition-all ${
                isLight
                  ? 'bg-slate-100/90 text-slate-900 border-slate-300 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
                  : 'bg-slate-950/70 text-white border-slate-800 placeholder-slate-400 focus:border-sky-400 focus:ring-sky-400/20'
              }`}
            />
            {searchQuery && (
              <button
                id="clear-search-query-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              id="gps-location-btn"
              onClick={onUseCurrentLocation}
              disabled={isLoadingLocation}
              className="absolute right-2 text-sky-500 hover:text-sky-600 p-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 transition-all border border-sky-500/20"
              title="Use My GPS Location"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Auto-complete & Recent / Popular Dropdown */}
          {isDropdownOpen && (
            <div
              id="search-dropdown-menu"
              className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl overflow-hidden z-50 divide-y ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800 divide-slate-100'
                  : 'bg-slate-900/95 border-slate-800 text-white divide-slate-800'
              }`}
            >
              {isSearching ? (
                <div className="p-4 flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                  Searching cities...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {searchResults.map((loc) => (
                    <button
                      key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                      onClick={() => handleLocationSelected(loc)}
                      className={`w-full text-left px-4 py-3 transition-all flex items-center justify-between group ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-sm font-semibold group-hover:text-sky-500">
                            {loc.name}
                          </p>
                          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {loc.admin1 ? `${loc.admin1}, ` : ''}
                            {loc.country || ''}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                        isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No location found for "{searchQuery}"
                </div>
              ) : (
                <div className="p-3 space-y-3">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between px-1 mb-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-400" />
                          Recent Searches
                        </span>
                        <button
                          onClick={clearRecentSearches}
                          className="text-[10px] text-rose-400 hover:text-rose-500 flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" /> Clear
                        </button>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((recLoc) => (
                          <button
                            key={`rec-${recLoc.id}`}
                            onClick={() => handleLocationSelected(recLoc)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-200'
                            }`}
                          >
                            <span className="truncate">{recLoc.name}, {recLoc.country}</span>
                            <MapPin className="w-3 h-3 text-sky-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Global Cities */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                      Popular Global Cities
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DEFAULT_LOCATIONS.map((popLoc) => (
                        <button
                          key={popLoc.id}
                          onClick={() => handleLocationSelected(popLoc)}
                          className={`text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                            isLight
                              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                              : 'bg-slate-950/60 hover:bg-white/10 border-slate-800 text-slate-200'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          <span className="truncate">{popLoc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            id="theme-toggle-desktop-btn"
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              isLight
                ? 'bg-slate-100 text-indigo-900 border-slate-200 hover:bg-slate-200'
                : 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>{isLight ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Favorite Toggle */}
          {currentLocation && (
            <button
              id="save-favorite-btn"
              onClick={() => onToggleFavorite(currentLocation)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${
                isCurrentFavorite
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-md'
                  : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={isCurrentFavorite ? 'Saved in Favorites' : 'Save Location'}
            >
              <Bookmark className={`w-4 h-4 ${isCurrentFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>{isCurrentFavorite ? 'Saved' : 'Save'}</span>
            </button>
          )}

          {/* Unit Toggle */}
          <button
            id="unit-toggle-btn"
            onClick={onToggleUnit}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 shadow-sm ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
            title="Switch Temperature Unit (°C / °F)"
          >
            <Thermometer className="w-4 h-4 text-sky-400" />
            <span>°{unit}</span>
          </button>

          {/* Simulation Mode Toggle */}
          <button
            id="open-simulation-modal-btn"
            onClick={onOpenSimulationModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/30 text-amber-500 hover:text-amber-600 text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Simulate Weather</span>
          </button>
        </div>
      </div>
    </header>
  );
};
