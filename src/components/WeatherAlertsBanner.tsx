import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, ChevronDown, ChevronUp, CheckCircle, ExternalLink } from 'lucide-react';
import { WeatherAlert, AlertSeverity } from '../types/weather';

interface WeatherAlertsBannerProps {
  alerts: WeatherAlert[];
  themeMode?: 'dark' | 'light';
}

export const WeatherAlertsBanner: React.FC<WeatherAlertsBannerProps> = ({ alerts, themeMode = 'dark' }) => {
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});

  if (!alerts || alerts.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: themeMode === 'light' ? 'bg-rose-500/10 border-rose-500/30 text-rose-900' : 'bg-rose-500/15 border-rose-500/40 text-rose-100',
          badge: 'bg-rose-500 text-white',
          icon: <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse shrink-0" />,
        };
      case 'warning':
        return {
          bg: themeMode === 'light' ? 'bg-amber-500/10 border-amber-500/30 text-amber-900' : 'bg-amber-500/15 border-amber-500/40 text-amber-100',
          badge: 'bg-amber-500 text-slate-950 font-bold',
          icon: <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />,
        };
      case 'advisory':
      default:
        return {
          bg: themeMode === 'light' ? 'bg-sky-500/10 border-sky-500/30 text-sky-900' : 'bg-sky-500/15 border-sky-500/40 text-sky-100',
          badge: 'bg-sky-500 text-white',
          icon: <Info className="w-6 h-6 text-sky-400 shrink-0" />,
        };
    }
  };

  return (
    <section id="weather-alerts-section" className="w-full mb-6 space-y-3">
      <div className="flex items-center gap-2 mb-1 px-1">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h2 className={`text-lg font-bold tracking-tight ${themeMode === 'light' ? 'text-slate-800' : 'text-white'}`}>
          Active Weather Alerts ({alerts.length})
        </h2>
      </div>

      {alerts.map((alert) => {
        const style = getSeverityStyle(alert.severity);
        const isExpanded = !!expandedAlerts[alert.id];

        return (
          <div
            key={alert.id}
            id={`alert-card-${alert.id}`}
            className={`rounded-2xl border backdrop-blur-md p-4 transition-all duration-200 shadow-sm ${style.bg}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {style.icon}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider font-extrabold ${style.badge}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs opacity-75 font-medium">
                      Effective: {alert.effective} • Expires: {alert.expires}
                    </span>
                  </div>

                  <h3 className="font-bold text-base md:text-lg leading-snug">
                    {alert.headline}
                  </h3>

                  <p className="text-sm opacity-90 line-clamp-2 md:line-clamp-none">
                    {alert.description}
                  </p>
                </div>
              </div>

              <button
                id={`toggle-alert-btn-${alert.id}`}
                onClick={() => toggleExpand(alert.id)}
                className={`p-2 rounded-xl transition-colors hover:bg-black/10 shrink-0 ${
                  themeMode === 'light' ? 'text-slate-700' : 'text-slate-200'
                }`}
                title={isExpanded ? 'Show less' : 'Show safety instructions'}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {isExpanded && alert.instruction && (
              <div className={`mt-4 pt-3 border-t text-sm space-y-2 ${
                themeMode === 'light' ? 'border-slate-900/10' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Recommended Action & Safety Instructions:</span>
                </div>
                <p className="pl-5 text-sm opacity-95 leading-relaxed italic">
                  "{alert.instruction}"
                </p>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};
