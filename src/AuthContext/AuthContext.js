import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const value = {
    // currentUser,
    setCurrentUser,
    // userData,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
