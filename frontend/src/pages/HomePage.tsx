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
      setIsModalOpen(true);
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

  const handleFavoriteClick = (recipe: RecipeCardData) => {
    if (favorites.some(fav => fav.id === recipe.id)) {
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        <FiltersPanel 
          currentFilters={filters}
          onFilterChange={handleFilterChange} 
        />
        
        {error && (
          <div className="text-red-500 text-center my-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={handleRecipeClick}
                onFavoriteClick={handleFavoriteClick}
                isFavorite={favorites.some(fav => fav.id === recipe.id)}
              />
            ))}
          </div>
        )}

        {isModalOpen && selectedRecipe && (
          <RecipeDetailModal
            recipe={selectedRecipe}
            onClose={handleCloseModal}
            isLoading={isLoadingDetails}
            isFavorite={favorites.some(fav => fav.id === selectedRecipe.id)}
            onFavoriteClick={() => handleFavoriteClick(selectedRecipe)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;