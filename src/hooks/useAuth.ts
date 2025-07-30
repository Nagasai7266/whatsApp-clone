import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';

const STORAGE_KEY = 'whatsapp-clone-auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setAuthState({ user, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (email: string, password: string, name: string): boolean => {
    // Simulate login validation
    if (email && password && name) {
      const user: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        status: 'Available',
        lastSeen: new Date(),
        isOnline: true,
        avatar: `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face`
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setAuthState({ user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({ user: null, isAuthenticated: false });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      setAuthState({ user: updatedUser, isAuthenticated: true });
    }
  };

  return {
    ...authState,
    login,
    logout,
    updateProfile
  };
};