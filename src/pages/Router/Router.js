import { Login } from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Forget from "../Forget/Forget";
import Profile from "../Profile/Profile";
import Dashboard from "../Dashboard/Dashboard";
import React, { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import { get, getDatabase, ref } from "firebase/database";
import { useAuth } from "../../AuthContext/AuthContext";
import UserProfile from "../UserProfile/UserProfile";
import ProtectedRoute from "../../protectedRoute/ProtectedRoute";
import Loader from "../../components/Loader/Loader";

const AuthRedirect = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to="/dashboard" replace={true} /> : <Outlet />;
};

const Router = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setUserData, loading, setLoading } = useAuth();

  const getCurrentUserData = async (uid) => {
    const database = getDatabase();
    get(ref(database, `/profile/${uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user data", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        getCurrentUserData(user.uid);
      } else {
        if (!["/", "/signup", "/forget"].includes(window.location.pathname)) {
          navigate("/");
        }
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, setCurrentUser, setUserData, loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route element={<AuthRedirect />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget" element={<Forget />} />
      </Route>

      {!loading && (
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />
        </Route>
      )}
    </Routes>
  );
};

export default Router;
