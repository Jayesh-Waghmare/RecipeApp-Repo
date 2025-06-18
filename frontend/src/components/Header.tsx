import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg sticky top-0 z-40 dark:from-blue-800 dark:to-blue-900">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold text-white tracking-tight">
          Recipe<span className="text-yellow-300">App</span>
        </Link>
        <div className="space-x-6 flex items-center">
          <Link
            to="/"
            className="text-white text-lg font-medium hover:text-yellow-200 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className="text-white text-lg font-medium hover:text-yellow-200 transition-colors duration-300"
          >
            Favorites
          </Link>
          <Link
            to="/meal-planner"
            className="text-white text-lg font-medium hover:text-yellow-200 transition-colors duration-300"
          >
            Meal Planner
          </Link>
          <Link
            to="/analytics"
            className="text-white text-lg font-medium hover:text-yellow-200 transition-colors duration-300"
          >
            Analytics
          </Link>
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" color='yellow'>
              <circle cx="12" cy="12" r="5.6" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
              <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
              <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
            </svg>
            
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header; 