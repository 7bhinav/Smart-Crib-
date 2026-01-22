import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VitalSignsChart = ({ data, timeRange, onTimeRangeChange }) => {
  const timeRanges = [
    { value: '15min', label: '15 Min' },
    { value: '1hr', label: '1 Hour' },
    { value: '4hr', label: '4 Hours' },
    { value: '24hr', label: '24 Hours' }
  ];

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

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Vital Signs Trends</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time monitoring with 2-second updates</p>
        </div>
        <div className="flex gap-2">
          {timeRanges?.map((range) => (
            <button
              key={range?.value}
              onClick={() => onTimeRangeChange(range?.value)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-250 ${
                timeRange === range?.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {range?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-64 md:h-80 lg:h-96" aria-label="Vital Signs Trend Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="heartRate" 
              stroke="var(--color-error)" 
              strokeWidth={2}
              dot={false}
              name="Heart Rate (BPM)"
            />
            <Line 
              type="monotone" 
              dataKey="oxygenSaturation" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={false}
              name="Oxygen Saturation (%)"
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="var(--color-warning)" 
              strokeWidth={2}
              dot={false}
              name="Body Temperature (°F)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VitalSignsChart;