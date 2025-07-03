import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {
  FaHeartbeat,
  FaWeight,
  FaTint,
  FaTemperatureHigh,
  FaLungs,
  FaRegClock,
  FaTachometerAlt,
} from "react-icons/fa";

const VitalsScreen = () => {
  const [vitalsHistory, setVitalsHistory] = useState([]);
  // Load vitals data from localStorage  // Date picker state
  const [selectedDate, setSelectedDate] = useState("");

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

  // Process and filter data based on date range and view mode
  const processedData = useMemo(() => {
    if (vitalsHistory.length === 0) return [];

    let filteredData = vitalsHistory;

    // Filter by selected date if provided
    if (selectedDate) {
      const selectedDateObj = dayjs(selectedDate);
      filteredData = vitalsHistory.filter((entry) => {
        const entryDate = dayjs(entry.date, "MM/DD/YYYY");
        return entryDate.isSame(selectedDateObj, "day");
      });
    }

    const processedEntries = filteredData.map((entry) => {
      const entryDate = dayjs(entry.date, "MM/DD/YYYY");
      return {
        id: entry.id,
        date: entryDate.format("MM/DD/YYYY"),
        displayDate: entryDate.format("DD MMM"),
        fullDate: entryDate.format("MM/DD/YYYY"),
        time: entry.timestamp,
        bloodPressureSys: entry.bloodPressureSys?.value
          ? parseInt(entry.bloodPressureSys.value)
          : null,
        bloodPressureDia: entry.bloodPressureDia?.value
          ? parseInt(entry.bloodPressureDia.value)
          : null,
        heartRate: entry.heartRate?.value
          ? parseInt(entry.heartRate.value)
          : null,
        spO2: entry.pulseOx?.value ? parseInt(entry.pulseOx.value) : null,
        bmi: entry.bmi ? parseFloat(entry.bmi) : null,
        temperature: entry.temperature?.value
          ? parseFloat(entry.temperature.value)
          : null,
        bloodGlucose: entry.bloodGlucose?.value
          ? parseInt(entry.bloodGlucose.value)
          : null,
        weight: entry.weight?.value ? parseInt(entry.weight.value) : null,
        height: entry.height?.value ? parseInt(entry.height.value) : null,
      };
    });

    // Sort by date
    processedEntries.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

    return processedEntries;
  }, [vitalsHistory, selectedDate]);

  // Custom tooltip component

  // Helper: Get latest value for each vital
  const getLatestVital = (key) => {
    if (processedData.length === 0) return null;
    // If date is selected, show the first entry for that date, otherwise show the most recent
    return processedData[0][key] ?? null;
  };

  // Helper: Get latest date/time
  const getLatestDate = () => {
    if (processedData.length === 0) return null;
    return processedData[0].fullDate;
  };
  // Helper: Get latest date/time
  const getLatestTime = () => {
    if (processedData.length === 0) return null;
    return processedData[0].time;
  };

  // Card config for vitals
  const vitalsCards = [
    {
      key: "heartRate",
      label: "Heart Rate",
      icon: <FaHeartbeat className="text-blue-500 w-6 h-6" />,
      unit: "bpm",
      button: "Track Progress",
    },
    {
      key: "bloodPressureSys",
      label: "Blood Pressure",
      icon: <FaTachometerAlt className="text-green-500 w-6 h-6" />,
      unit: "mmHg",
      button: "Track Progress",
      isBloodPressure: true,
    },
    {
      key: "temperature",
      label: "Temperature",
      icon: <FaTemperatureHigh className="text-orange-500 w-6 h-6" />,
      unit: "°F",
      button: "Track progress",
    },
    {
      key: "bloodGlucose",
      label: "Blood Sugar",
      icon: <FaTint className="text-pink-500 w-6 h-6" />,
      unit: "mg/dL",
      button: "Track Progress",
    },
    {
      key: "spO2",
      label: "Oxy Level",
      icon: <FaLungs className="text-cyan-500 w-6 h-6" />,
      unit: "%",
      button: "Track Progress",
    },
    {
      key: "respirationRate",
      label: "Respiration Rate",
      icon: <FaRegClock className="text-indigo-500 w-6 h-6" />,
      unit: "",
      button: "Check Details",
    },
    {
      key: "weight",
      label: "Weight",
      icon: <FaWeight className="text-gray-500 w-6 h-6" />,
      unit: "kg",
      button: "Track Progress",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              See your Vitals
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mr-2">
                Choose Date
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate("")}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter status indicator */}
          {selectedDate && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-800">
                    Showing vitals for:{" "}
                    {dayjs(selectedDate).format("MMMM DD, YYYY")}
                  </span>
                  {processedData.length === 0 && (
                    <span className="text-sm text-red-600">
                      (No data found for this date)
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDate("")}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Show all dates
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {vitalsCards.map((vital) => {
              let value = getLatestVital(vital.key);

              let date = getLatestDate();
              let time = getLatestTime();
              // Special case for blood pressure (show sys/dia)
              if (vital.isBloodPressure) {
                const sys = getLatestVital("bloodPressureSys");
                const dia = getLatestVital("bloodPressureDia");
                value = sys && dia ? `${sys}/${dia}` : "--";
              }
              if (value === null || value === undefined) value = "--";
              return (
                <div
                  key={vital.key}
                  className="bg-white rounded-lg shadow p-6 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {vital.icon}
                      <span className="text-md font-semibold text-gray-700">
                        {vital.label}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {value}{" "}
                      {!vital.isBloodPressure && vital.unit ? vital.unit : null}
                    </div>
                    <div className="text-xs mb-4 ">
                      <span className="font-bold text-green-500">
                        Uploaded Date and Time
                      </span>
                      <br />
                      {date ? `${date}, ${time}` : "--"}
                    </div>
                  </div>
                  <button className="w-full bg-white border border-blue-500 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
                    {vital.button}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsScreen;
