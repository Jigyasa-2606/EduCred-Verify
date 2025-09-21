import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage"; // ✅ New Signup Page
import QRScanPage from "./pages/QRScanPage"; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Navbar stays on all pages */}
        <Navbar />

        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpPage />} /> {/* ✅ Signup route */}
            <Route path="/scan" element={<QRScanPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

