import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Demo sign in
  const signInWithGoogle = async () => {
    try {
      const demoUser = {
        uid: 'demo-user-123',
        email: 'student@college.edu',
        displayName: 'Demo Student'
      };
      
      setCurrentUser(demoUser);
      setUserProfile({
        id: 1,
        name: 'Demo Student',
        enrollment_id: '2401010001',
        email: 'student@college.edu'
      });
      
      return demoUser;
    } catch (error) {
      console.error('Error in demo sign in:', error);
      throw error;
    }
  };

  // Demo sign out
  const logout = async () => {
    setCurrentUser(null);
    setUserProfile(null);
  };

  const linkAccount = async () => {
    return userProfile;
  };

  const getUserProfile = async () => {
    return userProfile;
  };

  const value = {
    currentUser,
    userProfile,
    signInWithGoogle,
    logout,
    linkAccount,
    getUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
