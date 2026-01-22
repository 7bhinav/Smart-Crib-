import React from 'react';
import Icon from '../../../components/AppIcon';

const HealthScoreCard = ({ title, score, trend, status, description, icon }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return 'text-success bg-success/10';
      case 'good':
        return 'text-primary bg-primary/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'critical':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 hover:shadow-md transition-all duration-250">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${getStatusColor()}`}>
          <Icon name={icon} size={20} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={16} />
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>

      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl md:text-3xl font-bold text-foreground">{score}</span>
        <span className="text-sm text-muted-foreground">/100</span>
      </div>
      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{description}</p>
    </div>
  );
};

export default HealthScoreCard;