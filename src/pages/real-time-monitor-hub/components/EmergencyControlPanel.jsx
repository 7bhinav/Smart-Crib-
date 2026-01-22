import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyControlPanel = ({ onExport, onThresholdAdjust }) => {
  const [showThresholds, setShowThresholds] = useState(false);

  const thresholds = [
    { id: 'heartRate', label: 'Heart Rate', min: 100, max: 160, unit: 'BPM', icon: 'Heart' },
    { id: 'oxygen', label: 'Oxygen Saturation', min: 95, max: 100, unit: '%', icon: 'Wind' },
    { id: 'temperature', label: 'Body Temperature', min: 97.0, max: 99.5, unit: '°F', icon: 'Thermometer' }
  ];

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          iconName="Download"
          iconPosition="left"
          onClick={handleExport}
        >
          Export Health Report
        </Button>

        <Button
          variant="outline"
          fullWidth
          iconName="Settings"
          iconPosition="left"
          onClick={() => setShowThresholds(!showThresholds)}
        >
          {showThresholds ? 'Hide' : 'Adjust'} Thresholds
        </Button>

        {showThresholds && (
          <div className="mt-4 space-y-4 p-4 bg-muted/50 rounded-lg">
            {thresholds?.map((threshold) => (
              <div key={threshold?.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name={threshold?.icon} size={16} color="var(--color-primary)" />
                  <span className="text-sm font-medium text-foreground">{threshold?.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Min</label>
                    <input
                      type="number"
                      defaultValue={threshold?.min}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Max</label>
                    <input
                      type="number"
                      defaultValue={threshold?.max}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="default"
              fullWidth
              size="sm"
              onClick={() => {
                if (onThresholdAdjust) {
                  onThresholdAdjust();
                }
                setShowThresholds(false);
              }}
            >
              Save Changes
            </Button>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Icon name="Shield" size={14} />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Lock" size={14} />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyControlPanel;