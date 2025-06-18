import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchRecipes, getRecipeInformation, getRandomRecipes } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import FiltersPanel from '../components/FiltersPanel';
import { useFavorites } from '../context/FavoritesContext';
import { RecipeCardData, Recipe, FilterOptions } from '../types/recipe';
import { useTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<RecipeCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: '',
    diet: '',
    maxTime: 0,
    sortBy: ''
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const loadRandomRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getRandomRecipes();
      setRecipes(results || []);
      if (!results || results.length === 0) {
        setError('No recipes available. Please try again later.');
      }
    } catch (err) {
      console.error('Error loading random recipes:', err);
      setRecipes([]);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomRecipes();
  }, []);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const removeFromRecentSearches = (index: number) => {
    setRecentSearches(prev => prev.filter((_, i) => i !== index));
  };

  const handleFilterChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setLoading(true);
    setError(null);

    try {
      if (searchQuery) {
        const results = await searchRecipes(searchQuery, newFilters);
        
        if (results && results.length > 0) {
          setRecipes(results);
        } else {
          setRecipes([]);
          setError('No recipes found matching your criteria.');
        }
      } else {
        const results = await getRandomRecipes();
        if (!results || results.length === 0) {
          setRecipes([]);
          setError('No recipes available. Please try again later.');
          return;
        }

        let filteredResults = [...results];

        if (newFilters.cuisine) {
          filteredResults = filteredResults.filter(recipe =>
            recipe.cuisines?.some(cuisine =>
              cuisine.toLowerCase().includes(newFilters.cuisine.toLowerCase())
            )
          );
        }

        if (newFilters.diet) {
          filteredResults = filteredResults.filter(recipe =>
            recipe.diets?.some(diet =>
              diet.toLowerCase().includes(newFilters.diet.toLowerCase())
            )
          );
        }

        if (newFilters.maxTime > 0) {
          filteredResults = filteredResults.filter(
            recipe => recipe.readyInMinutes <= newFilters.maxTime
          );
        }

        if (newFilters.sortBy) {
          switch (newFilters.sortBy) {
            case 'time-asc':
              filteredResults.sort((a, b) => (a.readyInMinutes || 0) - (b.readyInMinutes || 0));
              break;
            case 'time-desc':
              filteredResults.sort((a, b) => (b.readyInMinutes || 0) - (a.readyInMinutes || 0));
              break;
            case 'popularity':
              filteredResults.sort((a, b) => (b.aggregateLikes || 0) - (a.aggregateLikes || 0));
              break;
          }
        }

        if (filteredResults.length > 0) {
          setRecipes(filteredResults);
        } else {
          setRecipes([]);
          setError('No recipes found matching your criteria.');
        }
      }
    } catch (err: any) {
      console.error('Filter error:', err);
      setRecipes([]);
      setError(err.message || 'Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (ingredients: string[]) => {
    if (ingredients.length === 0) {
      setError('Please enter at least one ingredient');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const query = ingredients.join(', ');
      setSearchQuery(query);
      
      const results = await searchRecipes(query, filters);
      
      if (results && results.length > 0) {
        setRecipes(results);
      } else {
        setRecipes([]);
        setError('No recipes found. Try different ingredients or filters.');
      }
      addToRecentSearches(query);
    } catch (err: any) {
      console.error('Search error:', err);
      setRecipes([]);
      setError(err.message || 'Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = async (recipe: RecipeCardData) => {
    setIsLoadingDetails(true);
    setError(null);
    try {
      const details = await getRecipeInformation(recipe.id);
      setSelectedRecipe(details);
    } catch (err) {
      console.error('Error loading recipe details:', err);
      setError('Failed to load recipe details. Please try again.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleFavoriteClick = (recipe: any) => {
    const isFavorite = favorites.some((fav) => fav.id === recipe.id);
    if (isFavorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
              {recentSearches.length > 0 ? (
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => handleSearch(search.split(','))}
                    >
                      <span className="text-sm text-gray-600">{search}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromRecentSearches(index);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={clearRecentSearches}
                    className="w-full mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent searches</p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <FiltersPanel
                currentFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => handleRecipeClick(recipe)}
                    isFavorite={favorites.some(fav => fav.id === recipe.id)}
                    onFavoriteClick={() => {
                      if (favorites.some(fav => fav.id === recipe.id)) {
                        removeFromFavorites(recipe.id);
                      } else {
                        addToFavorites(recipe);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {isLoadingDetails ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Ready in</h3>
                      <p className="text-gray-600">{selectedRecipe.readyInMinutes} minutes</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Servings</h3>
                      <p className="text-gray-600">{selectedRecipe.servings}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedRecipe.extendedIngredients?.map((ingredient, index) => (
                        <li key={index} className="text-gray-600">
                          {ingredient.original}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                    <div className="prose max-w-none">
                      {selectedRecipe.instructions}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;