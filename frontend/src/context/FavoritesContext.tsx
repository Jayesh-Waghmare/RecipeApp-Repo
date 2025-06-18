import React, { createContext, useContext, useState, useEffect } from 'react';
import { RecipeCardData } from '../types/recipe';

interface FavoritesContextType {
  favorites: RecipeCardData[];
  addToFavorites: (recipe: RecipeCardData) => void;
  removeFromFavorites: (recipeId: number) => void;
  isFavorite: (recipeId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<RecipeCardData[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (recipe: RecipeCardData) => {
    setFavorites(prev => {
      if (!prev.some(fav => fav.id === recipe.id)) {
        return [...prev, recipe];
      }
      return prev;
    });
  };

  const removeFromFavorites = (recipeId: number) => {
    setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  const isFavorite = (recipeId: number) => {
    return favorites.some(recipe => recipe.id === recipeId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 