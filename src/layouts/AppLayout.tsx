import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarIcon, HistoryIcon, SettingsIcon, LogOutIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { signOut } from '../lib/supabase';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = async () => {
    await signOut();
  };

  const navItems = [
    { path: '/dashboard', icon: <HomeIcon size={20} />, text: 'Home' },
    { path: '/add-rent', icon: <CalendarIcon size={20} />, text: 'Rent' },
    { path: '/history', icon: <HistoryIcon size={20} />, text: 'History' },
    { path: '/settings', icon: <SettingsIcon size={20} />, text: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Logout"
            >
              <LogOutIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-3 px-2 text-sm ${
                  location.pathname === item.path
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom padding to account for fixed nav */}
      <div className="h-16"></div>
    </div>
  );
};

export default AppLayout;