import axios from 'axios';
import { Recipe, RecipeCardData, FilterOptions } from '../types/recipe';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export interface SearchParams {
  query?: string;
  ingredients?: string[];
  cuisine?: string;
  diet?: string;
  type?: string;
  maxReadyTime?: number;
  minCalories?: number;
  maxCalories?: number;
}

export const searchRecipes = async (query: string, filters?: FilterOptions): Promise<RecipeCardData[]> => {
  try {
    const params: any = {
      query,
      number: 20,
      addRecipeInformation: true,
      fillIngredients: true
    };

    if (filters) {
      if (filters.cuisine) {
        params.cuisine = filters.cuisine.toLowerCase();
      }
      if (filters.diet) {
        params.diet = filters.diet.toLowerCase();
      }
      if (filters.maxTime > 0) {
        params.maxReadyTime = filters.maxTime;
      }
    }

    const response = await axios.get(`${API_BASE_URL}/recipes/search`, { params });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error: any) {
    console.error('Search API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch recipes');
  }
};

export const getRecipeDetails = async (id: number): Promise<Recipe> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/information/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching recipe details:', error.response?.data || error.message);
    throw new Error('Failed to fetch recipe details');
  }
};

export const getRandomRecipes = async (): Promise<RecipeCardData[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/random`, {
      params: {
        number: 20,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error: any) {
    console.error('Error fetching random recipes:', error.response?.data || error.message);
    throw new Error('Failed to fetch random recipes');
  }
};

export const getRecipeInformation = async (id: number): Promise<Recipe> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/information/${id}`, {
      params: {
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

export const getAvailableFilters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/available-filters`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch available filters');
    }

    const data = await response.json();
    return {
      cuisines: data.cuisines || [],
      diets: data.diets || [],
    };
  } catch (error) {
    console.error('Error fetching available filters:', error);
    return {
      cuisines: [],
      diets: [],
    };
  }
}; 