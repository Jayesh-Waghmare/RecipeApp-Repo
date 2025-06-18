import React, { useState } from 'react';

interface IngredientSearchProps {
  onSearch: (ingredients: string[]) => void;
}

const IngredientSearch: React.FC<IngredientSearchProps> = ({ onSearch }) => {
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [inputValue, setInputValue] = useState('');

  const handleAddIngredient = () => {
    if (inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleSearch = () => {
    const validIngredients = ingredients.filter((ing) => ing.trim() !== '');
    if (validIngredients.length > 0) {
      onSearch(validIngredients);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Find Recipes by Ingredients</h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm dark:bg-blue-800 dark:text-blue-100"
            >
              <span>{ingredient}</span>
              {ingredient && (
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full dark:text-blue-300 dark:hover:text-blue-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add an ingredient..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 dark:placeholder-gray-300"
          />
          <button
            onClick={handleAddIngredient}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <button
          onClick={handleSearch}
          disabled={ingredients.every((ing) => !ing.trim())}
          className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mt-4 dark:bg-green-700 dark:hover:bg-green-800 dark:disabled:bg-gray-500"
        >
          Find Recipes
        </button>
      </div>
    </div>
  );
};

export default IngredientSearch; 