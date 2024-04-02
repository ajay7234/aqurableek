import { Login } from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Forget from "../Forget/Forget";
import Profile from "../Profile/Profile";
import Dashboard from "../Dashboard/Dashboard";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import { get, getDatabase, ref } from "firebase/database";
import { useAuth } from "../../AuthContext/AuthContext";
import UserProfile from "../UserProfile/UserProfile";

const Router = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setUserData } = useAuth();

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
    });

    return () => unsubscribe();
  }, [navigate, setCurrentUser, setUserData]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forget" element={<Forget />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user-profile/:id" element={<UserProfile />} />
    </Routes>
  );
};

export default Router;
