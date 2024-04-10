import Router from "./pages/Router/Router";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { useState } from "react";

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
