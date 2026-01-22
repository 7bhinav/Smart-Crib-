import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const getSeverityConfig = (severity) => {
  const configs = {
    critical: { bg: 'bg-error/10', border: 'border-error/30', text: 'text-error', icon: 'AlertTriangle' },
    warning: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', icon: 'AlertCircle' },
    info: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: 'Info' }
  };
  return configs?.[severity] || configs.info;
};

const DeviationAlerts = ({ alerts = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? alerts : alerts.slice(0, 3);

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Deviation Alerts</h2>
        <span className="text-xs text-muted-foreground">{alerts?.length || 0} total</span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No deviation alerts</div>
        ) : (
          visible.map((alert, idx) => {
            const cfg = getSeverityConfig(alert?.severity);
            return (
              <div key={idx} className={`rounded-lg border p-3 transition-shadow duration-200 ${cfg.border} ${cfg.bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center ${cfg.text} bg-current/10`}>
                      <Icon name={cfg.icon} size={16} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1">{alert?.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{alert?.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.text}`}>{(alert?.severity || '').toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground">{alert?.time}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground flex flex-wrap gap-3">
                  <div className="flex items-center gap-1"><Icon name="Activity" size={12} className="text-muted-foreground" /> <span className="font-medium text-foreground">{alert?.value}</span></div>
                  <div className="flex items-center gap-1"><Icon name="Target" size={12} className="text-muted-foreground" /> <span className="text-muted-foreground">{alert?.normalRange}</span></div>
                  <div className="flex items-center gap-1"><Icon name="TrendingUp" size={12} className="text-muted-foreground" /> <span className={`font-medium ${cfg.text}`}>{alert?.deviation}</span></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {alerts.length > 3 && (
        <div className="mt-3 flex items-center justify-center">
          <button className="text-sm text-primary hover:underline" onClick={() => setExpanded(v => !v)}>
            {expanded ? 'Show less' : `Show all (${alerts.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviationAlerts;