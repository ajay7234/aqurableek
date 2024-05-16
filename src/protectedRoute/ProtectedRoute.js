import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const currentUserId = localStorage.getItem("AuthToken");
  return currentUserId ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
