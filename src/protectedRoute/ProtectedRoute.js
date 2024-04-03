import React from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/" replace={true} />;
}

export default ProtectedRoute;
