import React, { useState, useEffect, useMemo } from "react";
import {
  FaHeartbeat,
  FaTint,
  FaTachometerAlt,
  FaThermometerHalf,
  FaBed,
  FaUserMd,
  FaCheckCircle,
} from "react-icons/fa";

const SmartAlertScreen = () => {
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Load vitals data from localStorage
  useEffect(() => {
    const loadVitalsData = () => {
      const savedHistory = localStorage.getItem("vitalsHistory");
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setVitalsHistory(history);
      }
    };

    // Load data initially
    loadVitalsData();

    // Listen for storage changes (when data is added from other components)
    const handleStorageChange = (e) => {
      if (e.key === "vitalsHistory") {
        loadVitalsData();
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadVitalsData();
    };

    window.addEventListener("vitalsDataUpdated", handleCustomStorageChange);

    // Periodic refresh as fallback (every 30 seconds)
    const intervalId = setInterval(loadVitalsData, 30000);

    // Cleanup event listeners and interval
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("vitalsDataUpdated", handleCustomStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Anomaly detection thresholds
  const thresholds = {
    heartRate: { min: 60, max: 120, unit: "BPM" },
    spO2: { min: 95, max: 100, unit: "%" },
    bloodPressureSys: { min: 90, max: 140, unit: "mmHg" },
    bloodPressureDia: { min: 60, max: 90, unit: "mmHg" },
    temperature: { min: 97, max: 99.5, unit: "°F" },
    bloodGlucose: { min: 70, max: 140, unit: "mg/dL" },
  };

  // Alert configurations
  const alertConfigs = {
    heartRate: {
      high: {
        icon: <FaHeartbeat className="text-red-500 w-5 h-5" />,
        color: "red",
        title: "⚠️ High Heart Rate",
        severity: "high",
      },
      low: {
        icon: <FaHeartbeat className="text-blue-500 w-5 h-5" />,
        color: "blue",
        title: "⚠️ Low Heart Rate",
        severity: "medium",
      },
    },
    spO2: {
      low: {
        icon: <FaTint className="text-red-500 w-5 h-5" />,
        color: "red",
        title: "🫁 Low Oxygen Level",
        severity: "high",
      },
    },
    bloodPressure: {
      high: {
        icon: <FaTachometerAlt className="text-red-500 w-5 h-5" />,
        color: "red",
        title: "⚠️ High Blood Pressure",
        severity: "high",
      },
      low: {
        icon: <FaTachometerAlt className="text-blue-500 w-5 h-5" />,
        color: "blue",
        title: "⚠️ Low Blood Pressure",
        severity: "medium",
      },
    },
    temperature: {
      high: {
        icon: <FaThermometerHalf className="text-red-500 w-5 h-5" />,
        color: "red",
        title: "🌡️ High Temperature",
        severity: "high",
      },
      low: {
        icon: <FaThermometerHalf className="text-blue-500 w-5 h-5" />,
        color: "blue",
        title: "🌡️ Low Temperature",
        severity: "medium",
      },
    },
    bloodGlucose: {
      high: {
        icon: <FaTint className="text-red-500 w-5 h-5" />,
        color: "red",
        title: "🍯 High Blood Sugar",
        severity: "high",
      },
      low: {
        icon: <FaTint className="text-blue-500 w-5 h-5" />,
        color: "blue",
        title: "🍯 Low Blood Sugar",
        severity: "high",
      },
    },
  };

  // Recommendation configurations
  const recommendationConfigs = {
    heartRate: {
      high: [
        {
          icon: <FaBed className="text-blue-500 w-5 h-5" />,
          title: "Take Rest",
          description: "Rest for 15-20 minutes in a comfortable position",
          priority: "high",
        },
        {
          icon: <FaTint className="text-blue-500 w-5 h-5" />,
          title: "Drink Water",
          description: "Stay hydrated to help regulate heart rate",
          priority: "medium",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Consult Doctor",
          description:
            "If heart rate remains elevated for more than 30 minutes",
          priority: "high",
        },
      ],
      low: [
        {
          icon: <FaBed className="text-blue-500 w-5 h-5" />,
          title: "Take Rest",
          description: "Rest and avoid strenuous activities",
          priority: "medium",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Consult Doctor",
          description: "If heart rate is consistently below 60 BPM",
          priority: "high",
        },
      ],
    },
    spO2: {
      low: [
        {
          icon: <FaBed className="text-blue-500 w-5 h-5" />,
          title: "Rest & Breathe Deeply",
          description: "Take slow, deep breaths and rest",
          priority: "high",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Seek Medical Attention",
          description: "If SpO2 is below 95% for more than 10 minutes",
          priority: "high",
        },
      ],
    },
    bloodPressure: {
      high: [
        {
          icon: <FaBed className="text-blue-500 w-5 h-5" />,
          title: "Rest & Relax",
          description: "Sit quietly and practice deep breathing",
          priority: "high",
        },
        {
          icon: <FaTint className="text-blue-500 w-5 h-5" />,
          title: "Reduce Salt Intake",
          description: "Avoid salty foods and processed foods",
          priority: "medium",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Consult Doctor",
          description: "If BP remains high for more than 1 hour",
          priority: "high",
        },
      ],
      low: [
        {
          icon: <FaTint className="text-blue-500 w-5 h-5" />,
          title: "Drink Water",
          description: "Stay hydrated to help raise blood pressure",
          priority: "medium",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Consult Doctor",
          description: "If BP is consistently low",
          priority: "high",
        },
      ],
    },
    temperature: {
      high: [
        {
          icon: <FaTint className="text-blue-500 w-5 h-5" />,
          title: "Stay Hydrated",
          description: "Drink plenty of fluids to help reduce fever",
          priority: "high",
        },
        {
          icon: <FaBed className="text-blue-500 w-5 h-5" />,
          title: "Rest",
          description: "Get adequate rest to help your body recover",
          priority: "medium",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Consult Doctor",
          description: "If temperature is above 103°F or persists",
          priority: "high",
        },
      ],
      low: [
        {
          icon: <FaBed className="text-blue-500 w-5 h-5" />,
          title: "Stay Warm",
          description: "Keep yourself warm and avoid cold exposure",
          priority: "medium",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Consult Doctor",
          description: "If temperature is consistently low",
          priority: "high",
        },
      ],
    },
    bloodGlucose: {
      high: [
        {
          icon: <FaTint className="text-blue-500 w-5 h-5" />,
          title: "Drink Water",
          description: "Stay hydrated to help flush excess glucose",
          priority: "medium",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Consult Doctor",
          description: "If blood sugar is consistently high",
          priority: "high",
        },
      ],
      low: [
        {
          icon: <FaTint className="text-blue-500 w-5 h-5" />,
          title: "Eat Something",
          description: "Consume a small snack with carbohydrates",
          priority: "high",
        },
        {
          icon: <FaUserMd className="text-red-500 w-5 h-5" />,
          title: "Seek Medical Attention",
          description: "If blood sugar is very low or you feel unwell",
          priority: "high",
        },
      ],
    },
  };

  // Detect anomalies and generate alerts
  const detectAnomalies = useMemo(() => {
    if (vitalsHistory.length === 0) return { alerts: [], recommendations: [] };

    const latestEntry = vitalsHistory[0]; // Most recent entry
    const detectedAlerts = [];
    const detectedRecommendations = [];

    // Check heart rate
    if (latestEntry.heartRate?.value) {
      const hr = parseInt(latestEntry.heartRate.value);
      if (hr > thresholds.heartRate.max) {
        detectedAlerts.push({
          type: "heartRate",
          condition: "high",
          value: hr,
          unit: thresholds.heartRate.unit,
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.heartRate.high,
        });
        detectedRecommendations.push(...recommendationConfigs.heartRate.high);
      } else if (hr < thresholds.heartRate.min) {
        detectedAlerts.push({
          type: "heartRate",
          condition: "low",
          value: hr,
          unit: thresholds.heartRate.unit,
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.heartRate.low,
        });
        detectedRecommendations.push(...recommendationConfigs.heartRate.low);
      }
    }

    // Check SpO2
    if (latestEntry.pulseOx?.value) {
      const spo2 = parseInt(latestEntry.pulseOx.value);
      if (spo2 < thresholds.spO2.min) {
        detectedAlerts.push({
          type: "spO2",
          condition: "low",
          value: spo2,
          unit: thresholds.spO2.unit,
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.spO2.low,
        });
        detectedRecommendations.push(...recommendationConfigs.spO2.low);
      }
    }

    // Check blood pressure
    if (
      latestEntry.bloodPressureSys?.value ||
      latestEntry.bloodPressureDia?.value
    ) {
      const sys = latestEntry.bloodPressureSys?.value
        ? parseInt(latestEntry.bloodPressureSys.value)
        : null;
      const dia = latestEntry.bloodPressureDia?.value
        ? parseInt(latestEntry.bloodPressureDia.value)
        : null;

      if (sys && sys > thresholds.bloodPressureSys.max) {
        detectedAlerts.push({
          type: "bloodPressure",
          condition: "high",
          value: `${sys}/${dia || "--"}`,
          unit: "mmHg",
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.bloodPressure.high,
        });
        detectedRecommendations.push(
          ...recommendationConfigs.bloodPressure.high
        );
      } else if (sys && sys < thresholds.bloodPressureSys.min) {
        detectedAlerts.push({
          type: "bloodPressure",
          condition: "low",
          value: `${sys}/${dia || "--"}`,
          unit: "mmHg",
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.bloodPressure.low,
        });
        detectedRecommendations.push(
          ...recommendationConfigs.bloodPressure.low
        );
      } else if (dia && dia > thresholds.bloodPressureDia.max) {
        detectedAlerts.push({
          type: "bloodPressure",
          condition: "high",
          value: `${sys || "--"}/${dia}`,
          unit: "mmHg",
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.bloodPressure.high,
        });
        detectedRecommendations.push(
          ...recommendationConfigs.bloodPressure.high
        );
      } else if (dia && dia < thresholds.bloodPressureDia.min) {
        detectedAlerts.push({
          type: "bloodPressure",
          condition: "low",
          value: `${sys || "--"}/${dia}`,
          unit: "mmHg",
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.bloodPressure.low,
        });
        detectedRecommendations.push(
          ...recommendationConfigs.bloodPressure.low
        );
      }
    }

    // Check temperature
    if (latestEntry.temperature?.value) {
      const temp = parseFloat(latestEntry.temperature.value);
      if (temp > thresholds.temperature.max) {
        detectedAlerts.push({
          type: "temperature",
          condition: "high",
          value: temp,
          unit: thresholds.temperature.unit,
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.temperature.high,
        });
        detectedRecommendations.push(...recommendationConfigs.temperature.high);
      } else if (temp < thresholds.temperature.min) {
        detectedAlerts.push({
          type: "temperature",
          condition: "low",
          value: temp,
          unit: thresholds.temperature.unit,
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.temperature.low,
        });
        detectedRecommendations.push(...recommendationConfigs.temperature.low);
      }
    }

    // Check blood glucose
    if (latestEntry.bloodGlucose?.value) {
      const glucose = parseInt(latestEntry.bloodGlucose.value);
      if (glucose > thresholds.bloodGlucose.max) {
        detectedAlerts.push({
          type: "bloodGlucose",
          condition: "high",
          value: glucose,
          unit: thresholds.bloodGlucose.unit,
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.bloodGlucose.high,
        });
        detectedRecommendations.push(
          ...recommendationConfigs.bloodGlucose.high
        );
      } else if (glucose < thresholds.bloodGlucose.min) {
        detectedAlerts.push({
          type: "bloodGlucose",
          condition: "low",
          value: glucose,
          unit: thresholds.bloodGlucose.unit,
          date: latestEntry.date,
          time: latestEntry.timestamp,
          ...alertConfigs.bloodGlucose.low,
        });
        detectedRecommendations.push(...recommendationConfigs.bloodGlucose.low);
      }
    }

    // Remove duplicate recommendations
    const uniqueRecommendations = detectedRecommendations.filter(
      (rec, index, self) =>
        index === self.findIndex((r) => r.title === rec.title)
    );

    return {
      alerts: detectedAlerts,
      recommendations: uniqueRecommendations,
    };
  }, [vitalsHistory]);

  // Update alerts and recommendations when anomalies are detected
  useEffect(() => {
    setAlerts(detectAnomalies.alerts);
    setRecommendations(detectAnomalies.recommendations);
  }, [detectAnomalies]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Alert Screen
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitoring your vital signs for anomalies
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FaCheckCircle className="text-green-500 w-4 h-4" />
                <span className="text-sm text-gray-600">
                  {vitalsHistory.length > 0 ? "Monitoring Active" : "No Data"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Overview */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Current Status
                  </h2>
                  <p className="text-sm text-gray-600">
                    Last updated:{" "}
                    {vitalsHistory.length > 0
                      ? `${vitalsHistory[0].date} at ${vitalsHistory[0].timestamp}`
                      : "No data available"}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {alerts.length}
                    </div>
                    <div className="text-sm text-gray-600">Active Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {recommendations.length}
                    </div>
                    <div className="text-sm text-gray-600">Recommendations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          {alerts.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                ⚠️ Active Alerts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`border-l-4 p-4 rounded-lg shadow-sm ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    <div className="flex items-start space-x-3">
                      {alert.icon}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Value: {alert.value} {alert.unit}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.date} at {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <FaCheckCircle className="text-green-500 w-8 h-8 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-900">
                  All Vitals Normal
                </h3>
                <p className="text-green-700">
                  No anomalies detected in your latest vital signs.
                </p>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Recommended Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 border border-gray-200"
                  >
                    <div className="flex items-start space-x-3">
                      {rec.icon}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            {rec.title}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
                              rec.priority
                            )} bg-opacity-10`}
                          >
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Threshold Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Normal Ranges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(thresholds).map(([key, threshold]) => (
                <div
                  key={key}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <h3 className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Normal: {threshold.min} - {threshold.max} {threshold.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAlertScreen;
