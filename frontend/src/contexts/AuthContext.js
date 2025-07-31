import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Login with email and password
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        const { token, student } = data;
        localStorage.setItem('token', token);
        setToken(token);
        setCurrentUser(student);
        setUserProfile(student);
        return student;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Get user profile with stats
  const getUserProfile = async () => {
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setUserProfile(data.profile);
        return data;
      } else {
        throw new Error(data.error || 'Failed to get profile');
      }
    } catch (error) {
      console.error('Error getting profile:', error);
      // If token is invalid, logout
      if (error.message.includes('token') || error.message.includes('401')) {
        logout();
      }
      throw error;
    }
  };

  // Get user stats
  const getUserStats = async () => {
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to get stats');
      }
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  };

  // Get solved questions
  const getSolvedQuestions = async (page = 1, limit = 20, platform = null) => {
    if (!token) return null;
    
    try {
      let url = `${API_BASE_URL}/user/solved-questions?page=${page}&limit=${limit}`;
      if (platform) {
        url += `&platform=${platform}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to get solved questions');
      }
    } catch (error) {
      console.error('Error getting solved questions:', error);
      throw error;
    }
  };

  // Sync student progress
  const syncProgress = async () => {
    if (!token || !currentUser) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/sync/student/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to sync progress');
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profileData = await getUserProfile();
          setCurrentUser(profileData.profile);
        } catch (error) {
          console.error('Error initializing auth:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const value = {
    currentUser,
    userProfile,
    token,
    login,
    logout,
    getUserProfile,
    getUserStats,
    getSolvedQuestions,
    syncProgress,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
