import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TrendAnalysisPanel = ({ trends = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? trends : (trends || []).slice(0, 3);
  const getStatusIcon = (status) => {
    switch (status) {
      case 'improving':
        return { name: 'TrendingUp', color: 'text-success' };
      case 'stable':
        return { name: 'Minus', color: 'text-primary' };
      case 'declining':
        return { name: 'TrendingDown', color: 'text-warning' };
      case 'critical':
        return { name: 'AlertTriangle', color: 'text-error' };
      default:
        return { name: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: 'bg-success/10 text-success',
      medium: 'bg-warning/10 text-warning',
      high: 'bg-error/10 text-error'
    };
    return badges?.[severity] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          Trend Analysis
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Last updated: 2 min ago</span>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {visible?.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No trend data</div>
        ) : (
          visible.map((trend, idx) => {
            const statusIcon = getStatusIcon(trend?.status);
            return (
              <div key={idx} className="p-3 rounded-lg border border-border hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center ${statusIcon?.color} bg-current/10`}>
                      <Icon name={statusIcon?.name} size={16} className={statusIcon?.color} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1">{trend?.metric}</h3>
                      <p className="text-xs text-muted-foreground">{trend?.period}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(trend?.severity)}`}>{trend?.severity?.toUpperCase()}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <div className="text-xs">Average</div>
                    <div className="font-semibold text-foreground">{trend?.average}</div>
                  </div>
                  <div>
                    <div className="text-xs">Change</div>
                    <div className={`font-semibold ${statusIcon?.color}`}>{trend?.change}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {trends?.length > 3 && (
        <div className="mt-3 flex items-center justify-center">
          <button className="text-sm text-primary hover:underline" onClick={() => setExpanded(v => !v)}>
            {expanded ? 'Show less' : `Show all (${trends?.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysisPanel;