import React, { useState, KeyboardEvent } from 'react';

interface SearchInputProps {
  onSearch: (ingredients: string[]) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!ingredients.includes(input.trim())) {
        setIngredients([...ingredients, input.trim()]);
      }
      setInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    if (ingredients.length > 0) {
      onSearch(ingredients);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white">
        {ingredients.map((ingredient, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
          >
            {ingredient}
            <button
              onClick={() => removeIngredient(index)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type ingredients and press Enter"
          className="flex-1 min-w-[200px] outline-none"
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={ingredients.length === 0}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Search Recipes
      </button>
    </div>
  );
};

export default SearchInput; 