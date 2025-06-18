import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { RecipeCardData, Recipe } from '../types/recipe';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { getRecipeInformation } from '../services/recipeService';

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const [detailedRecipe, setDetailedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecipeClick = async (recipe: RecipeCardData) => {
    try {
      setIsLoadingDetails(true);
      setError(null);
      const detailedRecipeData = await getRecipeInformation(recipe.id);
      setDetailedRecipe(detailedRecipeData);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to load recipe details. Please try again.');
      console.error('Error loading recipe details:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDetailedRecipe(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        My Favorite Recipes
      </h1>

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>You haven't added any recipes to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleRecipeClick(recipe)}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  {recipe.title}
                </h2>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="mr-4">
                    <svg
                      className="w-5 h-5 inline mr-1"
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
                    {recipe.readyInMinutes} mins
                  </span>
                  <span>
                    <svg
                      className="w-5 h-5 inline mr-1"
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
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && detailedRecipe && (
        <RecipeDetailModal
          recipe={detailedRecipe}
          onClose={handleCloseModal}
          isLoading={isLoadingDetails}
          isFavorite={true}
          onFavoriteClick={() => removeFromFavorites(detailedRecipe.id)}
        />
      )}
    </div>
  );
};

export default FavoritesPage; 