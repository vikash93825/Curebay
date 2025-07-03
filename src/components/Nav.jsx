import React from "react";
import { useLocation, useNavigate } from "react-router";

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/",
      icon: (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
          />
        </>
      ),
    },
    {
      id: "health-records",
      name: "Health Records",
      path: "/vitals-dashboard",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
    },
    {
      id: "smart-alerts",
      name: "Smart Alerts",
      path: "/smart-alerts",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      ),
    },
    {
      id: "appointments",
      name: "My Appointments",
      path: null, // no navigation
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 21h6"
        />
      ),
    },
    {
      id: "schedule",
      name: "My Schedule",
      path: null, // no navigation
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 21h6"
        />
      ),
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  const handleItemClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div
          className="flex items-center mb-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          {/* CureBay SVG Logo */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3"
          >
            <rect x="2" y="2" width="16" height="16" rx="3" fill="#4F8FCB"/>
            <rect x="22" y="22" width="16" height="16" rx="3" fill="#5CB28B"/>
            <rect x="2" y="22" width="16" height="16" rx="3" fill="#B6D0E8"/>
            <rect x="22" y="2" width="16" height="16" rx="3" fill="#E3F1F8"/>
          </svg>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 leading-tight">CureBay</span>
            <span className="text-xs text-gray-500 -mt-1">for a healthier India</span>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <div
                key={item.id}
                className={`flex items-center px-4 py-3 rounded-lg ${
                  active
                    ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                }`}
                onClick={() => handleItemClick(item.path)}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon}
                </svg>
                <span className={active ? "font-medium" : ""}>{item.name}</span>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Nav;
