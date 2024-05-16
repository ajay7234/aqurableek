import { Login } from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Forget from "../Forget/Forget";
import Profile from "../Profile/Profile";
import Dashboard from "../Dashboard/Dashboard";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserProfile from "../UserProfile/UserProfile";
import ProtectedRoute from "../../protectedRoute/ProtectedRoute";
import Home from "../Home/Home";
import NotFound from "../not-found/NotFound";
import Post from "../post/Post";

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("AuthToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />
          }
        />
        <Route
          path="/forget"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Forget />
          }
        />
        <Route path="/*" element={<NotFound />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />
          <Route path="/post/:id" element={<Post />} />
        </Route>
      </Routes>
    </>
  );
};

export default Router;
