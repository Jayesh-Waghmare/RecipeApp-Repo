import React from 'react';
import { FilterOptions } from '../types/recipe';

interface FiltersPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ onFilterChange, currentFilters }) => {
  const handleCuisineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilters,
      cuisine: e.target.value
    });
  };

  const handleDietChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilters,
      diet: e.target.value
    });
  };

  const handleMaxTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...currentFilters,
      maxTime: parseInt(e.target.value) || 0
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilters,
      sortBy: e.target.value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Filter & Sort Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cuisine
          </label>
          <select
            id="cuisine"
            value={currentFilters.cuisine}
            onChange={handleCuisineChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          >
            <option value="">All Cuisines</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="asian">Asian</option>
            <option value="american">American</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="indian">Indian</option>
          </select>
        </div>

        <div>
          <label htmlFor="diet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dietary Preference
          </label>
          <select
            id="diet"
            value={currentFilters.diet}
            onChange={handleDietChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          >
            <option value="">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten Free</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>

        <div>
          <label htmlFor="maxTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Cooking Time (minutes)
          </label>
          <input
            type="number"
            id="maxTime"
            value={currentFilters.maxTime || ''}
            onChange={handleMaxTimeChange}
            min="0"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
            placeholder="e.g., 30"
          />
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            value={currentFilters.sortBy}
            onChange={handleSortChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          >
            <option value="">No Sorting</option>
            <option value="time-asc">Cooking Time (Shortest First)</option>
            <option value="time-desc">Cooking Time (Longest First)</option>
            <option value="popularity">Popularity</option>
            <option value="match">Match Accuracy</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;