import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const Dashboard = () => {
  const [selectedMember, setSelectedMember] = useState("Mrs Ananya Singh");
  const [selectedCorePlan, setSelectedCorePlan] = useState("Select");
  const [vitalsData, setVitalsData] = useState([]);

  // Load vitals data from localStorage
  useEffect(() => {
    const loadVitalsData = () => {
      const savedHistory = localStorage.getItem("vitalsHistory");
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setVitalsData(history);
      }
    };

    // Load data initially
    loadVitalsData();

    const handleStorageChange = (e) => {
      if (e.key === "vitalsHistory") {
        loadVitalsData();
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    const handleCustomStorageChange = () => {
      loadVitalsData();
    };

    window.addEventListener("vitalsDataUpdated", handleCustomStorageChange);

    const intervalId = setInterval(loadVitalsData, 30000);

    // Cleanup event listeners and interval
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "vitalsDataUpdated",
        handleCustomStorageChange
      );
      clearInterval(intervalId);
    };
  }, []);

  // Process vitals data for charts
  const processChartData = () => {
    if (vitalsData.length === 0) return [];

    return vitalsData.slice(0, 7).map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
      }),
      systolic: parseInt(entry.bloodPressureSys?.value || 0),
      diastolic: parseInt(entry.bloodPressureDia?.value || 0),
      pulse: parseInt(entry.heartRate?.value || 0),
      oxyLevel: parseInt(entry.pulseOx?.value || 0),
      weight: parseFloat(entry.weight?.value || 0),
    }));
  };

  const chartData = processChartData();

  // Get latest vitals
  const getLatestVitals = () => {
    if (vitalsData.length === 0)
      return {
        systolic: 110,
        diastolic: 110,
        pulse: 110,
        oxyLevel: 95,
        weight: 90.0,
      };

    const latest = vitalsData[0];
    return {
      systolic: parseInt(latest.bloodPressureSys?.value || 110),
      diastolic: parseInt(latest.bloodPressureDia?.value || 110),
      pulse: parseInt(latest.heartRate?.value || 110),
      oxyLevel: parseInt(latest.pulseOx?.value || 95),
      weight: parseFloat(latest.weight?.value || 90.0),
    };
  };

  const latestVitals = getLatestVitals();

  // Calculate min, avg, max for systolic
  const systolicValues = chartData.map((d) => d.systolic);
  const minValue = Math.min(...systolicValues);
  const maxValue = Math.max(...systolicValues);
  const avgValue = Math.round(
    systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Home</span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-900 font-medium">Dashboard</span>
          </div>
        </div>

        {/* Member Profile and Core Plans */}
        <div className="flex items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm text-sky-600 font-semibold mb-1">
                Member profile
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="px- py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
              >
                <option value="Mrs Ananya Singh">Mr Vikash Kumar</option>
                <option value="Mr John Doe">Mr Prashant Kumar</option>
                <option value="Ms Jane Smith">Mr Ravi Kumar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-sky-600 font-semibold mb-1">
              Select core plans
            </label>
            <select
              value={selectedCorePlan}
              onChange={(e) => setSelectedCorePlan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            >
              <option value="Select">Select</option>
              <option value="Basic Plan">Basic Plan</option>
              <option value="Premium Plan">Premium Plan</option>
              <option value="Family Plan">Family Plan</option>
            </select>
          </div>
        </div>

        {/* Care Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Heart Health Package */}
          <div className=" bg-purple-50 rounded-lg shadow-md p-6 border-l-4 border-purple-500 ">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Heart Health package
                </h3>
                <p className="text-sm text-gray-500">
                  Package expires on 29-01-2023
                </p>
              </div>
            </div>
          </div>

          {/* Diabetic Care Package */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Diabetic Care package
                </h3>
                <p className="text-sm text-gray-500">
                  Package expires on 29-01-2023
                </p>
              </div>
            </div>
          </div>

          {/* Ortho Care Package */}
          <div className="bg-pink-50 rounded-lg shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Ortho Care package
                </h3>
                <p className="text-sm text-gray-500">
                  Package expires on 29-01-2023
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Appointment */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-gray-900">
              Next Appointment is on{" "}
              <strong>12th Dec at 6 pm with Dr. Nishant Aggarwal</strong>
            </span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            Request for change
          </button>
        </div>

        {/* Overview of Vitals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Overview of Vitals
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Blood Pressure Chart */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="font-semibold text-gray-800 mb-1">
                  Blood Pressure
                </div>
                <div className="flex justify-between mb-1 px-2">
                  <div className="text-center">
                    <div className="text-green-600 font-semibold text-lg">
                      {minValue}
                    </div>
                    <div className="text-xs text-gray-500">Min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-semibold text-lg">
                      {avgValue}
                    </div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-semibold text-lg">
                      {maxValue}
                    </div>
                    <div className="text-xs text-gray-500">Max</div>
                  </div>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="systolic"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: "#ef4444", r: 2 }}
                      >
                        <LabelList
                          content={({ x, y, index }) => {
                            const s = chartData[index].systolic;
                            const d = chartData[index].diastolic;
                            return (
                              <text x={x} y={y - 10} fontSize={10} fill="#222">
                                {s}/{d}
                              </text>
                            );
                          }}
                        />
                      </Line>
                      <Line
                        type="monotone"
                        dataKey="diastolic"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2 px-2">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-red-500 inline-block"></span>
                    <span className="text-xs text-gray-600">Systolic</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>
                    <span className="text-xs text-gray-600">Diastolic</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Pulse and Weight - Vertical Stack */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* Pulse */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-40">
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm text-gray-600">Pulse</h3>
                      <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-pink-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {latestVitals.pulse}
                    </div>
                    <div className="text-xs text-gray-500">BPM</div>
                  </div>
                </div>

                {/* Weight */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-40">
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm text-gray-600">Weight</h3>
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-3m-3 3l-3-3"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {latestVitals.weight}
                    </div>
                    <div className="text-xs text-gray-500">kg</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Oxy Level Chart */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Oxy Level
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {latestVitals.oxyLevel}%
                  </div>
                </div>

                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis domain={[90, 100]} fontSize={10} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="oxyLevel"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={{ fill: "#06b6d4", r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[120px] flex items-center justify-center text-gray-400">
                    <span className="text-sm">No data available</span>
                  </div>
                )}

                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500">SpO2 98-100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
