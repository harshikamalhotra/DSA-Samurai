import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import QuestionsPage from './pages/QuestionsPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  // After splash, show the main app with automatic redirect to login
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/questions" 
              element={
                <ProtectedRoute>
                  <QuestionsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
