import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import ChatBot from '../../../components/ChatBot';

const AlertHistoryPanel = ({ alerts }) => {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'info':
      default:
        return 'Info';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-error/10 text-error border-error/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'info':
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const [expanded, setExpanded] = useState(false);
  const visibleAlerts = expanded ? alerts : alerts?.slice(0, 3) || [];
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState('');

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Alert History</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Live</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {alerts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <Icon name="CheckCircle" size={32} color="var(--color-success)" />
            </div>
            <p className="text-sm font-medium text-foreground">All Systems Normal</p>
            <p className="text-xs text-muted-foreground mt-1">No alerts in the last 24 hours</p>
          </div>
        ) : (
          visibleAlerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`border rounded-lg p-3 transition-all duration-250 hover:shadow-md ${getSeverityColor(alert?.severity)}`}
            >
              <div className="flex items-start gap-3">
                <Icon name={getSeverityIcon(alert?.severity)} size={18} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold line-clamp-1">{alert?.title}</h3>
                    <span className="text-xs whitespace-nowrap">{formatTime(alert?.timestamp)}</span>
                  </div>
                  <p className="text-xs opacity-90 line-clamp-2">{alert?.message}</p>
                  {alert?.metric && (
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium">
                      <span className="opacity-75">Value:</span>
                      <span>{alert?.metric?.value} {alert?.metric?.unit}</span>
                      {alert?.metric?.threshold && (
                        <span className="opacity-75">
                          (Threshold: {alert?.metric?.threshold} {alert?.metric?.unit})
                        </span>
                      )}

                      {/* show chat button for high severity or BP alerts */}
                      {(alert?.severity === 'critical' || (alert?.metric?.name || '').toLowerCase().includes('blood pressure')) && (
                        <button
                          className="ml-auto text-sm text-primary underline"
                          onClick={() => {
                            const ctx = `Alert: ${alert?.title} - ${alert?.message} Value: ${alert?.metric?.value} ${alert?.metric?.unit}`;
                            setChatContext(ctx);
                            setChatOpen(true);
                          }}
                        >
                          Chat
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts?.length > 3 && (
        <div className="mt-3 flex items-center justify-center">
          <button
            className="text-sm text-primary hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Show less' : `Show all (${alerts?.length})`}
          </button>
        </div>
      )}
      {chatOpen && (
        <ChatBot open={chatOpen} onClose={() => setChatOpen(false)} initialContext={chatContext} />
      )}
    </div>
  );
};

export default AlertHistoryPanel;