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
import { useDispatch, useSelector } from "react-redux";
import { fetchCollectionData, fetchUserData } from "../../redux/userSlice";

const AuthRedirect = () => {
  const { currentUser, currentUserPost, setCurrentUserPost } = useAuth();
  const user = useSelector((state) => state.user.data);
  return user ? <Navigate to='/dashboard' replace={true} /> : <Outlet />;
};

const Router = () => {
  const navigate = useNavigate();
  const {
    setCurrentUser,
    setUserData,
    loading,
    setLoading,
    currentUser,
    userData,
  } = useAuth();
  const dispatch = useDispatch();

  return (
    <Routes>
      <Route
        path='/'
        element={!localStorage.getItem("AuthToken") ? <Login /> : <Dashboard />}
      />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/forget' element={<Forget />} />

      {/* {!loading && ( */}
      <>
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/user-profile/:id' element={<UserProfile />} />
        </Route>
      </>
      {/* )} */}
    </Routes>
  );
};

export default Router;
