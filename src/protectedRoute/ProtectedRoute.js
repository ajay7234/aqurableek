import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const currentUserId = localStorage.getItem("AuthToken");
  return currentUserId ? <Outlet /> : <Navigate to='/' replace />;
}

export default ProtectedRoute;

//import { Navigate, Route } from "react-router-dom";
//
//const ProtectedRoute = ({ element, ...rest }) => {
//  const token = localStorage.getItem("token");
//
//  if (token) {
//    return <Route {...rest} element={element} />;
//  } else {
//    return <Navigate to='/' replace />;
//  }
//};
//
//export default ProtectedRoute;
