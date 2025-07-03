import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import InputField from "../../components/InputField";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const VitalsInputForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("warning");
  const [vitals, setVitals] = useState({
    height: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
    weight: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
    respirationRate: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
    temperature: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
    bloodPressureSys: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
    bloodPressureDia: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
    pulseOx: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
    bloodGlucose: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
    heartRate: {
      value: "",
      currentDate: "",
      timestamp: "",
    },
  });
  const [bmi, setBmi] = useState("");
  const [vitalsHistory, setVitalsHistory] = useState([]);

  // Load historical data on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("vitalsHistory");
    if (savedHistory) {
      setVitalsHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Calculate BMI when height and weight change
  useEffect(() => {
    if (vitals.height.value && vitals.weight.value) {
      const heightInMeters = parseInt(vitals.height.value) / 100;
      const weightInKg = parseInt(vitals.weight.value);
      const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(
        1
      );
      setBmi(bmiValue);
    } else {
      setBmi("");
    }
  }, [vitals.height.value, vitals.weight.value]);

  // Anomaly detection thresholds
  const thresholds = {
    heartRate: { min: 60, max: 120, unit: "BPM" },
    spO2: { min: 95, max: 100, unit: "%" },
    bloodPressureSys: { min: 90, max: 140, unit: "mmHg" },
    bloodPressureDia: { min: 60, max: 90, unit: "mmHg" },
    temperature: { min: 97, max: 99.5, unit: "°F" },
    bloodGlucose: { min: 70, max: 140, unit: "mg/dL" },
  };

  // Detect anomalies in vitals
  const detectAnomalies = (vitalsData) => {
    const anomalies = [];

    // Check heart rate
    if (vitalsData.heartRate?.value) {
      const hr = parseInt(vitalsData.heartRate.value);
      if (hr > thresholds.heartRate.max) {
        anomalies.push(`⚠️ High Heart Rate: ${hr} BPM (Normal: 60-120 BPM)`);
      } else if (hr < thresholds.heartRate.min) {
        anomalies.push(`⚠️ Low Heart Rate: ${hr} BPM (Normal: 60-120 BPM)`);
      }
    }

    // Check SpO2
    if (vitalsData.pulseOx?.value) {
      const spo2 = parseInt(vitalsData.pulseOx.value);
      if (spo2 < thresholds.spO2.min) {
        anomalies.push(`🫁 Low Oxygen Level: ${spo2}% (Normal: 95-100%)`);
      }
    }

    // Check blood pressure
    if (
      vitalsData.bloodPressureSys?.value ||
      vitalsData.bloodPressureDia?.value
    ) {
      const sys = vitalsData.bloodPressureSys?.value
        ? parseInt(vitalsData.bloodPressureSys.value)
        : null;
      const dia = vitalsData.bloodPressureDia?.value
        ? parseInt(vitalsData.bloodPressureDia.value)
        : null;

      if (sys && sys > thresholds.bloodPressureSys.max) {
        anomalies.push(
          `⚠️ High Blood Pressure: ${sys}/${
            dia || "--"
          } mmHg (Normal: 90-140/60-90 mmHg)`
        );
      } else if (sys && sys < thresholds.bloodPressureSys.min) {
        anomalies.push(
          `⚠️ Low Blood Pressure: ${sys}/${
            dia || "--"
          } mmHg (Normal: 90-140/60-90 mmHg)`
        );
      } else if (dia && dia > thresholds.bloodPressureDia.max) {
        anomalies.push(
          `⚠️ High Blood Pressure: ${
            sys || "--"
          }/${dia} mmHg (Normal: 90-140/60-90 mmHg)`
        );
      } else if (dia && dia < thresholds.bloodPressureDia.min) {
        anomalies.push(
          `⚠️ Low Blood Pressure: ${
            sys || "--"
          }/${dia} mmHg (Normal: 90-140/60-90 mmHg)`
        );
      }
    }

    // Check temperature
    if (vitalsData.temperature?.value) {
      const temp = parseFloat(vitalsData.temperature.value);
      if (temp > thresholds.temperature.max) {
        anomalies.push(`🌡️ High Temperature: ${temp}°F (Normal: 97-99.5°F)`);
      } else if (temp < thresholds.temperature.min) {
        anomalies.push(`🌡️ Low Temperature: ${temp}°F (Normal: 97-99.5°F)`);
      }
    }

    // Check blood glucose
    if (vitalsData.bloodGlucose?.value) {
      const glucose = parseInt(vitalsData.bloodGlucose.value);
      if (glucose > thresholds.bloodGlucose.max) {
        anomalies.push(
          `🍯 High Blood Sugar: ${glucose} mg/dL (Normal: 70-140 mg/dL)`
        );
      } else if (glucose < thresholds.bloodGlucose.min) {
        anomalies.push(
          `🍯 Low Blood Sugar: ${glucose} mg/dL (Normal: 70-140 mg/dL)`
        );
      }
    }

    return anomalies;
  };

  const handleInputChange = (field, value) => {
    setVitals((prev) => ({
      ...prev,
      [field]: {
        value,
        currentDate: dayjs().format("MM/DD/YYYY"),
        timestamp: dayjs().format("H.mm"),
      },
    }));
  };

  const handleSave = () => {
    const currentDate = dayjs();
    const vitalsEntry = {
      id: Date.now(), // Simple ID generation
      date: currentDate.format("MM/DD/YYYY"),
      timestamp: currentDate.format("H.mm"),
      formattedDate: currentDate.format("MM/DD/YYYY"),
      ...vitals,
      bmi: bmi || null,
    };

    // Detect anomalies
    const anomalies = detectAnomalies(vitals);

    if (anomalies.length > 0) {
      setAlertMessage(anomalies.join("\n"));
      setAlertType("warning");
      setShowAlert(true);
    } else {
      setAlertMessage("✅ All vitals are within normal ranges!");
      setAlertType("success");
      setShowAlert(true);
    }

    // Add to history
    const updatedHistory = [vitalsEntry, ...vitalsHistory];
    setVitalsHistory(updatedHistory);

    // Save to localStorage for persistence
    localStorage.setItem("vitalsHistory", JSON.stringify(updatedHistory));

    // Dispatch custom event to notify other components about the data update
    window.dispatchEvent(new CustomEvent("vitalsDataUpdated"));

    // Reset form
    setVitals({
      height: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
      weight: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
      respirationRate: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
      temperature: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
      bloodPressureSys: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
      bloodPressureDia: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
      pulseOx: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
      bloodGlucose: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
      heartRate: {
        value: "",
        currentDate: "",
        timestamp: "",
      },
    });
    setBmi("");
    setIsModalOpen(false);

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const simulateScan = (field) => {
    // Simulate scanning with random values
    const simulatedValues = {
      height: Math.floor(Math.random() * 50 + 150), // 150-200 cm
      weight: Math.floor(Math.random() * 50 + 50), // 50-100 kg
      respirationRate: Math.floor(Math.random() * 10 + 12), // 12-22 breaths/min
      temperature: (Math.random() * 2 + 97).toFixed(1), // 97-99°F
      bloodPressureSys: Math.floor(Math.random() * 40 + 110), // 110-150 mmHg
      bloodPressureDia: Math.floor(Math.random() * 20 + 70), // 70-90 mmHg
      pulseOx: Math.floor(Math.random() * 5 + 95), // 95-100%
      bloodGlucose: Math.floor(Math.random() * 50 + 80), // 80-130 mg/dL
      heartRate: Math.floor(Math.random() * 40 + 60), // 60-100 bpm
    };

    handleInputChange(field, simulatedValues[field].toString());
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
        title="Add New Vitals"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>

      {/* History Toggle Button */}
      {vitalsHistory.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="fixed bottom-6 right-22 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
          title="View Vitals History"
        >
          <svg
            className="w-6 h-6"
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
        </button>
      )}

      {/* Alert Notification */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div
            className={`rounded-lg shadow-lg p-4 ${
              alertType === "warning"
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {alertType === "warning" ? (
                  <FaExclamationTriangle className="text-yellow-400 w-5 h-5" />
                ) : (
                  <FaCheckCircle className="text-green-400 w-5 h-5" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3
                  className={`text-sm font-medium ${
                    alertType === "warning"
                      ? "text-yellow-800"
                      : "text-green-800"
                  }`}
                >
                  {alertType === "warning"
                    ? "Anomalies Detected"
                    : "Vitals Saved"}
                </h3>
                <div
                  className={`mt-2 text-sm ${
                    alertType === "warning"
                      ? "text-yellow-700"
                      : "text-green-700"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {alertMessage}
                  </pre>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => setShowAlert(false)}
                  className={`inline-flex rounded-md p-1.5 ${
                    alertType === "warning"
                      ? "text-yellow-500 hover:bg-yellow-100"
                      : "text-green-500 hover:bg-green-100"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* History Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Vitals History ({vitalsHistory.length} entries)
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* History Body */}
            <div className="p-6">
              {vitalsHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No vitals history available
                </p>
              ) : (
                <div className="space-y-4">
                  {vitalsHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">
                          Entry #{entry.id}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {entry.formattedDate}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Height:</span>{" "}
                          {entry.height.value} cm
                          {entry.height.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.height.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Weight:</span>{" "}
                          {entry.weight.value} kg
                          {entry.weight.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.weight.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                        {entry.bmi && (
                          <div>
                            <span className="font-medium">BMI:</span>{" "}
                            {entry.bmi}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Temperature:</span>{" "}
                          {entry.temperature.value}°F
                          {entry.temperature.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.temperature.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Respiration:</span>{" "}
                          {entry.respirationRate.value}/min
                          {entry.respirationRate.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.respirationRate.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">BP Sys:</span>{" "}
                          {entry.bloodPressureSys.value} mmHg
                          {entry.bloodPressureSys.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.bloodPressureSys.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">BP Dia:</span>{" "}
                          {entry.bloodPressureDia.value} mmHg
                          {entry.bloodPressureDia.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.bloodPressureDia.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Pulse Ox:</span>{" "}
                          {entry.pulseOx.value}%
                          {entry.pulseOx.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.pulseOx.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Heart Rate:</span>{" "}
                          {entry.heartRate.value} BPM
                          {entry.heartRate.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.heartRate.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Blood Glucose:</span>{" "}
                          {entry.bloodGlucose.value} mg/dL
                          {entry.bloodGlucose.currentDate && (
                            <div className="text-xs text-gray-500">
                              {dayjs(entry.bloodGlucose.currentDate).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear History Button */}
            {vitalsHistory.length > 0 && (
              <div className="flex justify-between p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to clear all vitals history? This action cannot be undone."
                      )
                    ) {
                      setVitalsHistory([]);
                      localStorage.removeItem("vitalsHistory");
                      // Dispatch custom event to notify other components about the data update
                      window.dispatchEvent(
                        new CustomEvent("vitalsDataUpdated")
                      );
                      setShowHistory(false);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Clear History
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-md font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Add New Vitals
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Height */}
                <InputField
                  label="Height *"
                  value={vitals.height.value}
                  onChange={(value) => handleInputChange("height", value)}
                  onScan={() => simulateScan("height")}
                  unit="cm"
                  placeholder="Enter Height"
                />

                {/* Weight */}
                <InputField
                  label="Weight *"
                  value={vitals.weight.value}
                  onChange={(value) => handleInputChange("weight", value)}
                  onScan={() => simulateScan("weight")}
                  unit="kg"
                  placeholder="Enter Weight"
                />

                {/* BMI Display */}
                {bmi && (
                  <div className="col-span-1 md:col-span-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <span className="text-sm text-blue-800">
                        <strong>BMI: {bmi}</strong>{" "}
                        {bmi < 18.5
                          ? "(Underweight)"
                          : bmi < 25
                          ? "(Normal)"
                          : bmi < 30
                          ? "(Overweight)"
                          : "(Obese)"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Temperature */}
                <InputField
                  label="Temperature *"
                  value={vitals.temperature.value}
                  onChange={(value) => handleInputChange("temperature", value)}
                  onScan={() => simulateScan("temperature")}
                  unit="°F"
                  placeholder="Enter Temperature"
                />

                {/* Respiration Rate */}
                <InputField
                  label="Respiration Rate *"
                  value={vitals.respirationRate.value}
                  onChange={(value) =>
                    handleInputChange("respirationRate", value)
                  }
                  onScan={() => simulateScan("respirationRate")}
                  unit="breaths/min"
                  placeholder="Enter Respiration rate"
                />

                {/* Blood Pressure SYS */}
                <InputField
                  label="Blood Pressure (SYS) *"
                  value={vitals.bloodPressureSys.value}
                  onChange={(value) =>
                    handleInputChange("bloodPressureSys", value)
                  }
                  onScan={() => simulateScan("bloodPressureSys")}
                  unit="mmHg"
                  placeholder="Enter systolic"
                />

                {/* Blood Pressure DIA */}
                <InputField
                  label="Blood Pressure (DIA) *"
                  value={vitals.bloodPressureDia.value}
                  onChange={(value) =>
                    handleInputChange("bloodPressureDia", value)
                  }
                  onScan={() => simulateScan("bloodPressureDia")}
                  unit="mmHg"
                  placeholder="Enter diastolic"
                />

                {/* Pulse Ox */}
                <InputField
                  label="Pulse Ox*"
                  value={vitals.pulseOx.value}
                  onChange={(value) => handleInputChange("pulseOx", value)}
                  onScan={() => simulateScan("pulseOx")}
                  unit="%"
                  placeholder="Enter Pulse"
                />

                {/* Heart Rate */}
                <InputField
                  label="Heart Rate *"
                  value={vitals.heartRate.value}
                  onChange={(value) => handleInputChange("heartRate", value)}
                  onScan={() => simulateScan("heartRate")}
                  unit="Beats/min"
                  placeholder="Enter heart rate"
                />

                {/* Blood Glucose */}
                <div className="col-span-1 md:col-span-2">
                  <InputField
                    label="Blood Glucose*"
                    value={vitals.bloodGlucose.value}
                    onChange={(value) =>
                      handleInputChange("bloodGlucose", value)
                    }
                    onScan={() => simulateScan("bloodGlucose")}
                    unit="mg/dL"
                    placeholder="Please enter your Glucose"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VitalsInputForm;
