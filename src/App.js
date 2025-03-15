import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import KYCVerification from './components/KYC/KYCVerification';
import KYCDetails from './components/KYC/KYCDetails';
import Analytics from './components/Analytics/Analytics';
import Billing from './components/Billing/Billing';
import MainLayout from './components/Layout/MainLayout';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated (e.g., token in localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        } />
        
        <Route path="/" element={
          isAuthenticated ? (
            <MainLayout onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }>
          <Route index element={<Dashboard />} />
          <Route path="kyc" element={<KYCVerification />} />
          <Route path="kyc/:id" element={<KYCDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;