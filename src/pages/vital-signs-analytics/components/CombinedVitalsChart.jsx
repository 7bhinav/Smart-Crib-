import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CombinedVitalsChart = ({ data, showStatistics }) => {
  const [zoomDomain, setZoomDomain] = useState(null);
  const [activeMetrics, setActiveMetrics] = useState({
    heartRate: true,
    oxygenLevel: true
  });

  const toggleMetric = (metric) => {
    setActiveMetrics(prev => ({
      ...prev,
      [metric]: !prev?.[metric]
    }));
  };

  const resetZoom = () => {
    setZoomDomain(null);
  };

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
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">
            Vital Signs Correlation
          </h2>
          <p className="text-sm text-muted-foreground">
            Heart rate and oxygen saturation trends with statistical analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeMetrics?.heartRate ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleMetric('heartRate')}
          >
            Heart Rate
          </Button>
          <Button
            variant={activeMetrics?.oxygenLevel ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleMetric('oxygenLevel')}
          >
            O₂ Level
          </Button>
          {zoomDomain && (
            <Button
              variant="ghost"
              size="sm"
              iconName="ZoomOut"
              onClick={resetZoom}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      <div className="w-full flex-1 min-h-[16rem]" aria-label="Combined vital signs correlation chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              label={{ value: 'BPM', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              label={{ value: 'SpO₂ %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            
            {showStatistics && (
              <>
                <ReferenceLine 
                  yAxisId="left"
                  y={120} 
                  stroke="var(--color-primary)" 
                  strokeDasharray="3 3"
                  label={{ value: 'Normal HR', position: 'right', fontSize: 10 }}
                />
                <ReferenceLine 
                  yAxisId="right"
                  y={95} 
                  stroke="var(--color-secondary)" 
                  strokeDasharray="3 3"
                  label={{ value: 'Normal SpO₂', position: 'left', fontSize: 10 }}
                />
              </>
            )}

            {activeMetrics?.heartRate && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="heartRate"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
                name="Heart Rate (BPM)"
                activeDot={{ r: 6 }}
              />
            )}

            {activeMetrics?.oxygenLevel && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="oxygenLevel"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={false}
                name="Oxygen Level (%)"
                activeDot={{ r: 6 }}
              />
            )}

            <Brush 
              dataKey="time" 
              height={30} 
              stroke="var(--color-primary)"
              fill="var(--color-muted)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon name="Info" size={14} />
          <span>Drag on chart to zoom into specific time period</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="MousePointer" size={14} />
          <span>Hover over data points for detailed values</span>
        </div>
      </div>
    </div>
  );
};

export default CombinedVitalsChart;