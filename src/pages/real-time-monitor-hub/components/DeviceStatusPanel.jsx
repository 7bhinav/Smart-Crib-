import React from 'react';
import Icon from '../../../components/AppIcon';

const DeviceStatusPanel = ({ devices }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'warning':
        return 'AlertCircle';
      case 'disconnected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getSignalStrength = (strength) => {
    if (strength >= 80) return { bars: 4, color: 'text-success' };
    if (strength >= 60) return { bars: 3, color: 'text-success' };
    if (strength >= 40) return { bars: 2, color: 'text-warning' };
    return { bars: 1, color: 'text-error' };
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Device Status</h2>
        <div className="text-xs text-muted-foreground">
          {devices?.filter(d => d?.status === 'connected')?.length}/{devices?.length} Active
        </div>
      </div>

      <div className="space-y-2">
        {devices?.map((device) => {
          const signal = getSignalStrength(device?.signalStrength);
          return (
            <div
              key={device?.id}
              className="flex items-center justify-between px-3 h-14 rounded-md border border-border hover:shadow-sm transition-all duration-200 bg-white"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0`}> 
                  <Icon name={device?.icon} size={18} color="var(--color-foreground)" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-foreground line-clamp-1">{device?.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-end gap-0.5 h-4">
                  {[1, 2, 3, 4]?.map((bar) => (
                    <div
                      key={bar}
                      className={`w-1 rounded-t ${bar <= signal?.bars ? signal?.color : 'bg-muted'}`}
                      style={{ height: `${bar * 25}%` }}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{device?.signalStrength}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Last sync:</span>
          <span className="text-foreground font-medium">2 seconds ago</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceStatusPanel;