import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import AlertBanner from '../../components/ui/AlertBanner';
import FilterControls from './components/FilterControls';
import HealthScoreCard from './components/HealthScoreCard';
import CombinedVitalsChart from './components/CombinedVitalsChart';
import TrendAnalysisPanel from './components/TrendAnalysisPanel';
import DeviationAlerts from './components/DeviationAlerts';
import PatternComparison from './components/PatternComparison';
import StatisticalSummary from './components/StatisticalSummary';

const VitalSignsAnalytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedPatient, setSelectedPatient] = useState('patient_001');
  const [patternView, setPatternView] = useState('all');
  const [showStatistics, setShowStatistics] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const handleLogout = () => {
    // Logout handler for Header component
    console.log('Logging out...');
  };

  const healthScores = [
    {
      title: "Overall Health Score",
      score: 92,
      trend: 5,
      status: "excellent",
      description: "Excellent vital signs stability with consistent patterns across all metrics",
      icon: "Heart"
    },
    {
      title: "Heart Rate Stability",
      score: 88,
      trend: 3,
      status: "good",
      description: "Heart rate shows normal variation within expected pediatric ranges",
      icon: "Activity"
    },
    {
      title: "Oxygen Saturation",
      score: 96,
      trend: 2,
      status: "excellent",
      description: "Oxygen levels consistently maintained above 95% threshold",
      icon: "Wind"
    },
    {
      title: "Pattern Consistency",
      score: 85,
      trend: -2,
      status: "good",
      description: "Sleep-wake cycles showing regular patterns with minor variations",
      icon: "TrendingUp"
    }
  ];

  const chartData = [
    { time: "00:00", heartRate: 118, oxygenLevel: 97 },
    { time: "02:00", heartRate: 115, oxygenLevel: 96 },
    { time: "04:00", heartRate: 112, oxygenLevel: 98 },
    { time: "06:00", heartRate: 125, oxygenLevel: 97 },
    { time: "08:00", heartRate: 130, oxygenLevel: 96 },
    { time: "10:00", heartRate: 128, oxygenLevel: 97 },
    { time: "12:00", heartRate: 122, oxygenLevel: 98 },
    { time: "14:00", heartRate: 135, oxygenLevel: 95 },
    { time: "16:00", heartRate: 140, oxygenLevel: 94 },
    { time: "18:00", heartRate: 132, oxygenLevel: 96 },
    { time: "20:00", heartRate: 120, oxygenLevel: 97 },
    { time: "22:00", heartRate: 116, oxygenLevel: 98 }
  ];

  const trendAnalysis = [
    {
      metric: "Heart Rate Variability",
      period: "Last 7 days",
      status: "stable",
      severity: "low",
      average: "122 BPM",
      change: "+2.3%",
      analysis: "Heart rate shows consistent patterns with normal circadian rhythm. Slight increase during feeding times is expected and within normal parameters.",
      recommendation: "Continue current monitoring schedule. No intervention required."
    },
    {
      metric: "Oxygen Saturation Trends",
      period: "Last 7 days",
      status: "improving",
      severity: "low",
      average: "96.8%",
      change: "+1.2%",
      analysis: "Oxygen saturation levels have improved steadily over the past week. All readings remain above the 95% clinical threshold.",
      recommendation: "Maintain current respiratory support settings."
    },
    {
      metric: "Sleep Pattern Quality",
      period: "Last 7 days",
      status: "declining",
      severity: "medium",
      average: "14.2 hrs/day",
      change: "-8.5%",
      analysis: "Sleep duration has decreased slightly. Pattern shows more frequent wake periods during night hours, possibly related to growth spurts.",
      recommendation: "Monitor for signs of discomfort. Consider environmental adjustments for better sleep quality."
    }
  ];

  const deviationAlerts = [
    {
      severity: "critical",
      title: "Heart Rate Spike Detected",
      description: "Sudden increase in heart rate observed during feeding time",
      time: "2 hours ago",
      value: "152 BPM",
      normalRange: "110-130 BPM",
      deviation: "+22 BPM",
      clinicalSignificance: "Elevated heart rate during feeding is common but requires monitoring if persistent. Current spike resolved within 5 minutes."
    },
    {
      severity: "warning",
      title: "Oxygen Saturation Dip",
      description: "Brief decrease in SpO₂ levels during sleep transition",
      time: "4 hours ago",
      value: "93%",
      normalRange: "95-100%",
      deviation: "-2%",
      clinicalSignificance: "Temporary dip below threshold during REM sleep. Self-resolved without intervention. Continue monitoring."
    },
    {
      severity: "info",
      title: "Movement Pattern Change",
      description: "Increased activity detected during typical rest period",
      time: "6 hours ago",
      value: "High Activity",
      normalRange: "Low-Moderate",
      deviation: "N/A",
      clinicalSignificance: "Activity increase may indicate discomfort or developmental milestone. No vital sign abnormalities detected."
    }
  ];

  const comparisonData = {
    normal: [
      { metric: "HR 110-130", frequency: 245 },
      { metric: "SpO₂ 95-100", frequency: 268 },
      { metric: "Temp 36.5-37.5", frequency: 255 },
      { metric: "Motion Low", frequency: 180 }
    ],
    abnormal: [
      { metric: "HR >130", frequency: 38 },
      { metric: "SpO₂ <95", frequency: 12 },
      { metric: "Temp >37.5", frequency: 8 },
      { metric: "Motion High", frequency: 45 }
    ]
  };

  const statisticalData = [
    {
      metric: "Heart Rate",
      unit: "BPM",
      mean: "122.4",
      stdDev: "8.2",
      min: "108",
      max: "152",
      percentile25: "116",
      percentile50: "121",
      percentile75: "128",
      sampleSize: "2,016"
    },
    {
      metric: "Oxygen Saturation",
      unit: "%",
      mean: "96.8",
      stdDev: "1.4",
      min: "93",
      max: "100",
      percentile25: "96",
      percentile50: "97",
      percentile75: "98",
      sampleSize: "2,016"
    }
  ];

  const handleExport = () => {
    setAlertMessage('Generating clinical report with statistical analysis...');
    setAlertSeverity('info');
    setTimeout(() => {
      setAlertMessage('');
    }, 3000);
  };

  useEffect(() => {
    document.title = 'Vital Signs Analytics - BabyCrib Monitor';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="healthcare_professional" onLogout={handleLogout} />
      <TabNavigation userRole="healthcare_professional" />
      {alertMessage && (
        <AlertBanner
          severity={alertSeverity}
          message={alertMessage}
          onDismiss={() => setAlertMessage('')}
        />
      )}
      <main className="pt-32 lg:pt-28 pb-20 lg:pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Vital Signs Analytics
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Comprehensive historical analysis and pattern recognition for pediatric health assessment
            </p>
          </div>

          <FilterControls
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedPatient={selectedPatient}
            onPatientChange={setSelectedPatient}
            patternView={patternView}
            onPatternViewChange={setPatternView}
            onExport={handleExport}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {healthScores?.map((score, index) => (
              <HealthScoreCard key={index} {...score} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6 items-stretch">
            <div className="lg:col-span-8">
              <CombinedVitalsChart 
                data={chartData} 
                showStatistics={showStatistics}
              />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex-1">
                <TrendAnalysisPanel trends={trendAnalysis} />
              </div>
              <div>
                <DeviationAlerts alerts={deviationAlerts} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
            <div className="lg:col-span-8">
              <div className="h-full">
                <PatternComparison comparisonData={comparisonData} />
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex-1">
                <StatisticalSummary statistics={statisticalData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VitalSignsAnalytics;