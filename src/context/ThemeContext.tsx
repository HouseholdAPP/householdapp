import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }
    
    // If no preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Load user preference from database when user is authenticated
  useEffect(() => {
    if (user) {
      const loadUserPreference = async () => {
        const { data, error } = await supabase
          .from('user_settings')
          .select('dark_mode')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data) {
          setDarkMode(data.dark_mode);
          localStorage.setItem('darkMode', data.dark_mode.toString());
        }
      };
      
      loadUserPreference();
    }
  }, [user]);

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save theme preference
  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    // Save to database if user is logged in
    if (user) {
      await supabase
        .from('user_settings')
        .upsert({ 
          user_id: user.id, 
          dark_mode: newDarkMode 
        }, { 
          onConflict: 'user_id',
          ignoreDuplicates: false
        });
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};