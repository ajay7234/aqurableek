import { useEffect, useState } from "react";
import Router from "./pages/Router/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar/Sidebar";
import "react-loading-skeleton/dist/skeleton.css";
import "./App.css";
import { useAuth } from "./authContext/AuthContext";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setIsAuthenticated, isAuthenticated } = useAuth();

  useEffect(() => {}, [isAuthenticated]);

  return (
    <>
      <ToastContainer />
      {isAuthenticated && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <Router />
    </>
  );
}

export default App;
