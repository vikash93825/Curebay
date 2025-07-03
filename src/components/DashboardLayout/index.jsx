import React from "react";
import { Outlet } from "react-router";
import Nav from "../Nav";
import VitalsInputForm from "../../containers/VitalsInputForm";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
      <VitalsInputForm />
    </div>
  );
}

export default DashboardLayout;
