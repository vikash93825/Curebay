import React from "react";

function InputField({
  label,
  value,
  onChange,
  unit,
  onScan,
  placeholder,
  type = "number",
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs text-gray-600 font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {unit && (
            <span className="absolute right-3 top-2 text-xs text-gray-500">
              {unit}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onScan}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title={`Scan ${label}`}
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
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2m-6 4h4m-6 0h-2"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default InputField;
