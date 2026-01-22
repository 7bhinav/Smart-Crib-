import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  status = 'normal',
  trend = 'stable',
  trendValue = 0,
  sparklineData = [],
  threshold = {}
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'border-error bg-error/5';
      case 'warning':
        return 'border-warning bg-warning/5';
      case 'normal':
      default:
        return 'border-border bg-card';
    }
  };

  const getValueColor = () => {
    switch (status) {
      case 'critical':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'normal':
      default:
        return 'text-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      case 'stable':
      default:
        return 'Minus';
    }
  };

  const getTrendColor = () => {
    if (trend === 'stable') return 'text-muted-foreground';
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  return (
    <div className={`rounded-xl border-2 p-4 md:p-6 transition-all duration-250 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${
            status === 'critical' ? 'bg-error/10' : 
            status === 'warning'? 'bg-warning/10' : 'bg-primary/10'
          }`}>
            <Icon 
              name={icon} 
              size={20} 
              color={
                status === 'critical' ? 'var(--color-error)' : 
                status === 'warning' ? 'var(--color-warning)' : 
                'var(--color-primary)'
              } 
            />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-medium text-muted-foreground">{title}</h3>
            {threshold?.min && threshold?.max && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Range: {threshold?.min}-{threshold?.max} {unit}
              </p>
            )}
          </div>
        </div>
        {status !== 'normal' && (
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${
            status === 'critical' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
          }`}>
            {status === 'critical' ? 'Critical' : 'Warning'}
          </div>
        )}
      </div>
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl md:text-4xl lg:text-5xl font-bold font-data ${getValueColor()}`}>
            {value}
          </span>
          <span className="text-lg md:text-xl text-muted-foreground">{unit}</span>
        </div>
        <div className={`flex items-center gap-1.5 mt-2 text-sm ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={16} />
          <span className="font-medium">{Math.abs(trendValue)}{unit}</span>
          <span className="text-muted-foreground">vs last hour</span>
        </div>
      </div>
      {sparklineData?.length > 0 && (
        <div className="h-12 flex items-end gap-0.5">
          {sparklineData?.map((point, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all duration-250 ${
                status === 'critical' ? 'bg-error/30' : 
                status === 'warning'? 'bg-warning/30' : 'bg-primary/30'
              }`}
              style={{ height: `${(point / Math.max(...sparklineData)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MetricCard;