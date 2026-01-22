import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PatternComparison = ({ comparisonData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-foreground">{entry?.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getBarColor = (value, type) => {
    if (type === 'normal') return 'var(--color-success)';
    if (type === 'abnormal') return 'var(--color-error)';
    return 'var(--color-primary)';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">
          Pattern Comparison Analysis
        </h2>
        <p className="text-sm text-muted-foreground">
          Side-by-side comparison of normal vs abnormal vital sign patterns
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <h3 className="text-sm font-semibold text-foreground">Normal Patterns</h3>
          </div>
          <div className="w-full h-48 md:h-56" aria-label="Normal patterns bar chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData?.normal}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="metric" 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '11px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="frequency" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-success/10 rounded-lg">
              <p className="text-muted-foreground mb-1">Avg Duration</p>
              <p className="text-sm font-semibold text-foreground">4.2 hours</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <p className="text-muted-foreground mb-1">Occurrence</p>
              <p className="text-sm font-semibold text-foreground">87%</p>
            </div>
          </div>
        </div>

  <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error" />
            <h3 className="text-sm font-semibold text-foreground">Abnormal Patterns</h3>
          </div>
          <div className="w-full h-48 md:h-56" aria-label="Abnormal patterns bar chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData?.abnormal}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="metric" 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '11px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="frequency" fill="var(--color-error)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-error/10 rounded-lg">
              <p className="text-muted-foreground mb-1">Avg Duration</p>
              <p className="text-sm font-semibold text-foreground">0.8 hours</p>
            </div>
            <div className="p-3 bg-error/10 rounded-lg">
              <p className="text-muted-foreground mb-1">Occurrence</p>
              <p className="text-sm font-semibold text-foreground">13%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Key Insights</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Normal patterns show consistent heart rate between 110-130 BPM with minimal variation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Abnormal patterns correlate with feeding times and sleep cycle transitions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Oxygen saturation remains stable at 95-100% during both normal and abnormal heart rate patterns</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternComparison;