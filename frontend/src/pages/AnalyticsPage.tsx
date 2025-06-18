import React, { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';

interface SearchAnalytics {
  query: string;
  timestamp: number;
  resultCount: number;
}

const AnalyticsPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [searchHistory, setSearchHistory] = useState<SearchAnalytics[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const getMostPopularSearches = () => {
    const searchCounts = recentSearches.reduce((acc, search) => {
      acc[search] = (acc[search] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(searchCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }));
  };

  const getFavoriteStats = () => {
    const cuisineCounts = favorites.reduce((acc, recipe) => {
      recipe.cuisines?.forEach(cuisine => {
        acc[cuisine] = (acc[cuisine] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(cuisineCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cuisine, count]) => ({ cuisine, count }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        Recipe Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Search Analytics */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Search Analytics
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                Most Popular Searches
              </h3>
              <ul className="space-y-2">
                {getMostPopularSearches().map(({ query, count }) => (
                  <li key={query} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{query}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {count} searches
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Favorites Analytics */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Favorites Analytics
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                Top Cuisines in Favorites
              </h3>
              <ul className="space-y-2">
                {getFavoriteStats().map(({ cuisine, count }) => (
                  <li key={cuisine} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{cuisine}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {count} recipes
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                Total Favorites
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {favorites.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 