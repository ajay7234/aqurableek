import { useState } from "react";
import Router from "./pages/Router/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar/Sidebar";
import "react-loading-skeleton/dist/skeleton.css";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <ToastContainer />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Router />
    </>
  );
}

export default App;
