import React from 'react';
import { Bookmark, MapPin, Trash2 } from 'lucide-react';
import { LocationResult, ThemeMode } from '../types/weather';

interface SavedLocationsBarProps {
  favorites: LocationResult[];
  currentLocation: LocationResult | null;
  onSelectLocation: (loc: LocationResult) => void;
  onRemoveFavorite: (loc: LocationResult) => void;
  themeMode?: ThemeMode;
}

export const SavedLocationsBar: React.FC<SavedLocationsBarProps> = ({
  favorites,
  currentLocation,
  onSelectLocation,
  onRemoveFavorite,
  themeMode = 'dark',
}) => {
  if (!favorites || favorites.length === 0) return null;

  const isLight = themeMode === 'light';

  return (
    <div
      id="saved-locations-bar"
      className={`w-full rounded-2xl p-4 shadow-md mb-6 border backdrop-blur-xl transition-all ${
        isLight
          ? 'bg-white/80 border-slate-200 text-slate-800'
          : 'bg-slate-900/50 border-slate-800 text-white'
      }`}
    >
      <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${
        isLight ? 'text-slate-600' : 'text-slate-300'
      }`}>
        <Bookmark className="w-4 h-4 text-amber-500" />
        <span>Saved Favorite Locations ({favorites.length})</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-sky-500/20">
        {favorites.map((loc) => {
          const isSelected =
            currentLocation &&
            (currentLocation.id === loc.id ||
              (currentLocation.latitude === loc.latitude && currentLocation.longitude === loc.longitude));

          return (
            <div
              key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
              id={`favorite-chip-${loc.id}`}
              className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-400 text-sky-500 shadow-sm'
                  : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <button
                onClick={() => onSelectLocation(loc)}
                className="flex items-center gap-2 text-left"
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{loc.name}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(loc);
                }}
                className="p-0.5 rounded text-slate-400 hover:text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity ml-1"
                title="Remove from saved"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
