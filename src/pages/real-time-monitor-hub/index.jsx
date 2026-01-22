import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import AlertBanner from '../../components/ui/AlertBanner';
import SessionTimeout from '../../components/ui/SessionTimeout';
import MetricCard from './components/MetricCard';
import VitalSignsChart from './components/VitalSignsChart';
import AlertHistoryPanel from './components/AlertHistoryPanel';
import DeviceStatusPanel from './components/DeviceStatusPanel';
import EmergencyControlPanel from './components/EmergencyControlPanel';

const RealTimeMonitorHub = () => {
  const location = useLocation();
  const isEmergency = location?.state?.emergency || false;

  const [currentAlert, setCurrentAlert] = useState(null);
  const [timeRange, setTimeRange] = useState('1hr');
  const [userRole] = useState('healthcare_professional');

  const [vitalMetrics, setVitalMetrics] = useState({
    heartRate: { value: 128, status: 'normal', trend: 'stable', trendValue: 2 },
    oxygenSaturation: { value: 98, status: 'normal', trend: 'up', trendValue: 1 },
    bodyTemperature: { value: 98.6, status: 'normal', trend: 'stable', trendValue: 0.1 },
    envTemperature: { value: 72, status: 'normal', trend: 'down', trendValue: 1 },
    airQuality: { value: 45, status: 'normal', trend: 'stable', trendValue: 2 },
    motionStatus: { value: 'Active', status: 'normal', trend: 'stable', trendValue: 0 }
  });

  const [chartData, setChartData] = useState([
    { time: '14:30', heartRate: 125, oxygenSaturation: 97, temperature: 98.4 },
    { time: '14:35', heartRate: 128, oxygenSaturation: 98, temperature: 98.5 },
    { time: '14:40', heartRate: 130, oxygenSaturation: 97, temperature: 98.6 },
    { time: '14:45', heartRate: 127, oxygenSaturation: 98, temperature: 98.6 },
    { time: '14:50', heartRate: 129, oxygenSaturation: 98, temperature: 98.7 },
    { time: '14:55', heartRate: 126, oxygenSaturation: 99, temperature: 98.6 },
    { time: '15:00', heartRate: 128, oxygenSaturation: 98, temperature: 98.6 }
  ]);

  const [alertHistory, setAlertHistory] = useState([
    {
      id: 1,
      severity: 'warning',
      title: 'Oxygen Level Fluctuation',
      message: 'Oxygen saturation dropped to 94% briefly before recovering',
      timestamp: new Date(Date.now() - 3600000),
      metric: { value: 94, unit: '%', threshold: 95 }
    },
    {
      id: 2,
      severity: 'info',
      title: 'Temperature Adjustment',
      message: 'Room temperature adjusted to optimal range',
      timestamp: new Date(Date.now() - 7200000),
      metric: { value: 72, unit: '°F' }
    }
  ]);

  const [devices] = useState([
    { id: 1, name: 'Heart Rate Monitor', icon: 'Heart', status: 'connected', signalStrength: 92 },
    { id: 2, name: 'Pulse Oximeter', icon: 'Wind', status: 'connected', signalStrength: 88 },
    { id: 3, name: 'Temperature Sensor', icon: 'Thermometer', status: 'connected', signalStrength: 95 },
    { id: 4, name: 'Motion Detector', icon: 'Activity', status: 'connected', signalStrength: 78 },
    { id: 5, name: 'Air Quality Monitor', icon: 'CloudRain', status: 'connected', signalStrength: 85 }
  ]);

  useEffect(() => {
    if (isEmergency) {
      setCurrentAlert({
        severity: 'critical',
        message: 'Emergency access activated - All vital signs under immediate monitoring'
      });
    }
  }, [isEmergency]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      const newDataPoint = {
        time: timeStr,
        heartRate: Math.floor(Math.random() * 10) + 125,
        oxygenSaturation: Math.floor(Math.random() * 3) + 97,
        temperature: (Math.random() * 0.4 + 98.4)?.toFixed(1)
      };

      setChartData(prev => {
        const updated = [...prev?.slice(-6), newDataPoint];
        return updated;
      });

      setVitalMetrics(prev => ({
        ...prev,
        heartRate: { 
          ...prev?.heartRate, 
          value: newDataPoint?.heartRate,
          trend: newDataPoint?.heartRate > prev?.heartRate?.value ? 'up' : 
                 newDataPoint?.heartRate < prev?.heartRate?.value ? 'down' : 'stable'
        },
        oxygenSaturation: { 
          ...prev?.oxygenSaturation, 
          value: newDataPoint?.oxygenSaturation,
          trend: newDataPoint?.oxygenSaturation > prev?.oxygenSaturation?.value ? 'up' : 
                 newDataPoint?.oxygenSaturation < prev?.oxygenSaturation?.value ? 'down' : 'stable'
        },
        bodyTemperature: { 
          ...prev?.bodyTemperature, 
          value: parseFloat(newDataPoint?.temperature),
          trend: parseFloat(newDataPoint?.temperature) > prev?.bodyTemperature?.value ? 'up' : 
                 parseFloat(newDataPoint?.temperature) < prev?.bodyTemperature?.value ? 'down' : 'stable'
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    const reportData = {
      timestamp: new Date()?.toISOString(),
      metrics: vitalMetrics,
      chartData: chartData,
      alerts: alertHistory
    };
    console.log('Exporting health report:', reportData);
    setCurrentAlert({
      severity: 'info',
      message: 'Health report generated successfully and ready for download'
    });
  };

  const handleThresholdAdjust = () => {
    setCurrentAlert({
      severity: 'info',
      message: 'Alert thresholds updated successfully'
    });
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  const sparklineData = [120, 125, 128, 130, 127, 129, 126, 128];

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onLogout={handleLogout} />
      {currentAlert && (
        <AlertBanner
          severity={currentAlert?.severity}
          message={currentAlert?.message}
          onDismiss={() => setCurrentAlert(null)}
        />
      )}
      <TabNavigation userRole={userRole} />
      <main className="pt-32 pb-20 lg:pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Real-Time Monitor Hub
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Continuous infant health surveillance with live sensor data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <MetricCard
              title="Heart Rate"
              value={vitalMetrics?.heartRate?.value}
              unit="BPM"
              icon="Heart"
              status={vitalMetrics?.heartRate?.status}
              trend={vitalMetrics?.heartRate?.trend}
              trendValue={vitalMetrics?.heartRate?.trendValue}
              sparklineData={sparklineData}
              threshold={{ min: 100, max: 160 }}
            />
            <MetricCard
              title="Oxygen Saturation"
              value={vitalMetrics?.oxygenSaturation?.value}
              unit="%"
              icon="Wind"
              status={vitalMetrics?.oxygenSaturation?.status}
              trend={vitalMetrics?.oxygenSaturation?.trend}
              trendValue={vitalMetrics?.oxygenSaturation?.trendValue}
              sparklineData={sparklineData?.map(v => v - 30)}
              threshold={{ min: 95, max: 100 }}
            />
            <MetricCard
              title="Body Temperature"
              value={vitalMetrics?.bodyTemperature?.value}
              unit="°F"
              icon="Thermometer"
              status={vitalMetrics?.bodyTemperature?.status}
              trend={vitalMetrics?.bodyTemperature?.trend}
              trendValue={vitalMetrics?.bodyTemperature?.trendValue}
              sparklineData={sparklineData?.map(v => v - 30)}
              threshold={{ min: 97.0, max: 99.5 }}
            />
            <MetricCard
              title="Room Temperature"
              value={vitalMetrics?.envTemperature?.value}
              unit="°F"
              icon="Home"
              status={vitalMetrics?.envTemperature?.status}
              trend={vitalMetrics?.envTemperature?.trend}
              trendValue={vitalMetrics?.envTemperature?.trendValue}
              sparklineData={sparklineData?.map(v => v - 56)}
              threshold={{ min: 68, max: 75 }}
            />
            <MetricCard
              title="Air Quality Index"
              value={vitalMetrics?.airQuality?.value}
              unit="AQI"
              icon="CloudRain"
              status={vitalMetrics?.airQuality?.status}
              trend={vitalMetrics?.airQuality?.trend}
              trendValue={vitalMetrics?.airQuality?.trendValue}
              sparklineData={sparklineData?.map(v => v - 80)}
              threshold={{ min: 0, max: 50 }}
            />
            <MetricCard
              title="Motion Status"
              value={vitalMetrics?.motionStatus?.value}
              unit=""
              icon="Activity"
              status={vitalMetrics?.motionStatus?.status}
              trend={vitalMetrics?.motionStatus?.trend}
              trendValue={vitalMetrics?.motionStatus?.trendValue}
              sparklineData={sparklineData?.map(v => v - 100)}
            />
          </div>

          {/* Chart full width */}
          <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6">
            <div className="w-full">
              <VitalSignsChart
                data={chartData}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </div>
          </div>

          {/* Alert history and device status below the chart, aligned with the main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div>
              <AlertHistoryPanel alerts={alertHistory} />
            </div>
            <div>
              <DeviceStatusPanel devices={devices} />
            </div>
          </div>

          {/* Emergency / controls full width below */}
          <div className="w-full">
            <EmergencyControlPanel
              onExport={handleExport}
              onThresholdAdjust={handleThresholdAdjust}
            />
          </div>
        </div>
      </main>
      <SessionTimeout
        timeoutDuration={900000}
        warningDuration={60000}
        onLogout={handleLogout}
        onExtend={() => console.log('Session extended')}
      />
    </div>
  );
};

export default RealTimeMonitorHub;