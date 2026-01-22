import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticalSummary = ({ statistics }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          Statistical Summary
        </h2>
        <Icon name="BarChart3" size={20} className="text-primary" />
      </div>
  <div className="space-y-6 flex-1">
        {statistics?.map((stat, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{stat?.metric}</h3>
              <span className="text-xs text-muted-foreground">{stat?.unit}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="TrendingUp" size={12} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Mean</p>
                </div>
                <p className="text-base font-bold text-foreground">{stat?.mean}</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Activity" size={12} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Std Dev</p>
                </div>
                <p className="text-base font-bold text-foreground">{stat?.stdDev}</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="ArrowDown" size={12} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Min</p>
                </div>
                <p className="text-base font-bold text-foreground">{stat?.min}</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="ArrowUp" size={12} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Max</p>
                </div>
                <p className="text-base font-bold text-foreground">{stat?.max}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">25th Percentile</span>
                <span className="font-medium text-foreground">{stat?.percentile25}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">50th Percentile (Median)</span>
                <span className="font-medium text-foreground">{stat?.percentile50}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">75th Percentile</span>
                <span className="font-medium text-foreground">{stat?.percentile75}</span>
              </div>
            </div>

            {index < statistics?.length - 1 && (
              <div className="border-t border-border pt-3" />
            )}
          </div>
        ))}
      </div>
  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground leading-relaxed">
            Statistical analysis based on {statistics?.[0]?.sampleSize || 'N/A'} data points collected over the selected time period. Values represent clinical measurements with medical-grade accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticalSummary;