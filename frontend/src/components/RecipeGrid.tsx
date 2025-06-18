import React from 'react';
import RecipeCard from './RecipeCard';
import { Recipe } from '../context/MealPlannerContext';

interface RecipeGridProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onFavoriteClick?: (recipe: Recipe) => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  onSelectRecipe,
  onFavoriteClick = () => {},
}) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No recipes found
        </h2>
        <p className="text-gray-500">
          Try adjusting your search criteria or browse random recipes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onSelectRecipe(recipe)}
          onFavoriteClick={() => onFavoriteClick(recipe)}
        />
      ))}
    </div>
  );
};

export default RecipeGrid; 