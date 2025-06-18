import React from 'react';
import { Recipe, Ingredient, RecipeStep } from '../types/recipe';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  isLoading: boolean;
  isFavorite: boolean;
  onFavoriteClick: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  isLoading,
  isFavorite,
  onFavoriteClick,
}) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {recipe.title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={onFavoriteClick}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                className={`w-6 h-6 ${
                  isFavorite
                    ? 'text-red-500 fill-current'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {recipe.readyInMinutes} minutes
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {recipe.servings} servings
            </div>
          </div>

          {recipe.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </h3>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            </div>
          )}

          {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Ingredients
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.extendedIngredients.map((ingredient: Ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <span className="mr-2">•</span>
                    {ingredient.original}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Instructions
              </h3>
              <ol className="space-y-4">
                {recipe.analyzedInstructions[0].steps.map((step: RecipeStep) => (
                  <li
                    key={step.number}
                    className="flex gap-4 text-gray-700 dark:text-gray-300"
                  >
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {step.number}.
                    </span>
                    <span>{step.step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal; 