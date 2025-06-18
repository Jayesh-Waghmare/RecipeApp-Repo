require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.SPOONACULAR_API_KEY;

if (!API_KEY) {
  console.error('SPOONACULAR_API_KEY is not set in environment variables');
  process.exit(1);
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Helper function to sort recipes
const sortRecipes = (recipes, sortBy, sortDirection) => {
  if (!sortBy) return recipes;

  const sortedRecipes = [...recipes].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'popularity':
        comparison = (a.aggregateLikes || 0) - (b.aggregateLikes || 0);
        break;
      case 'time':
        comparison = (a.readyInMinutes || 0) - (b.readyInMinutes || 0);
        break;
      case 'match':
        comparison = (a.spoonacularScore || 0) - (b.spoonacularScore || 0);
        break;
      default:
        return 0;
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  return sortedRecipes;
};

// Search recipes with filters
app.get('/api/recipes/search', async (req, res) => {
  try {
    const {
      query,
      ingredients,
      cuisine,
      diet,
      maxTime,
      sortBy,
      sortDirection,
    } = req.query;

    const params = {
      apiKey: API_KEY,
      addRecipeInformation: true,
      fillIngredients: true,
      addRecipeNutrition: true,
      number: 12,
    };

    if (query) params.query = query;
    if (ingredients) params.includeIngredients = ingredients;
    if (cuisine && cuisine !== 'all') params.cuisine = cuisine;
    if (diet && diet !== 'all') params.diet = diet;
    if (maxTime) params.maxReadyInMinutes = maxTime;
    if (sortBy) {
      switch (sortBy) {
        case 'popularity':
          params.sort = 'popularity';
          break;
        case 'time':
          params.sort = 'time';
          break;
        case 'match':
          params.sort = 'max-used-ingredients';
          break;
      }
    }

    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/complexSearch`,
      {
        params: params,
        timeout: 5000, // 5 second timeout
      }
    );

    let recipes = response.data.results;

    if (sortBy) {
      recipes = sortRecipes(recipes, sortBy, sortDirection || 'desc');
    }

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error.response?.data || error.message);
    console.error('Axios Error Details:', error.code, error.config?.url);
    res.status(500).json({
      error: 'Failed to search recipes',
      details: error.response?.data || error.message
    });
  }
});

// Get random recipes
app.get('/api/recipes/random', async (req, res) => {
  try {
    const { number = 12 } = req.query;
    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/random`,
      {
        params: {
          apiKey: API_KEY,
          number,
          addRecipeInformation: true,
          fillIngredients: true,
        },
        timeout: 10000,
      }
    );

    const recipes = response.data.recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      cuisines: recipe.cuisines || [],
      dishTypes: recipe.dishTypes || [],
      instructions: recipe.analyzedInstructions?.[0]?.steps
        ?.map((step) => step.step)
        .join('\n') || '',
      extendedIngredients: recipe.extendedIngredients?.map((ing) => ({
        id: ing.id,
        original: ing.original,
        amount: ing.amount,
        unit: ing.unit,
      })) || [],
      nutrition: {
        nutrients: recipe.nutrition?.nutrients || [],
      },
      sourceUrl: recipe.sourceUrl,
    }));

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching random recipes:', error.response?.data || error.message);
    console.error('Axios Error Details:', error.code, error.config?.url);
    res.status(500).json({
      error: 'Failed to fetch random recipes',
      details: error.response?.data || error.message
    });
  }
});

// Get recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/${id}/information`,
      {
        params: {
          apiKey: API_KEY,
          addRecipeNutrition: true,
        },
        timeout: 5000, // 5 second timeout
      }
    );

    const recipe = {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      readyInMinutes: response.data.readyInMinutes,
      servings: response.data.servings,
      cuisines: response.data.cuisines || [],
      dishTypes: response.data.dishTypes || [],
      instructions: response.data.analyzedInstructions?.[0]?.steps
        ?.map((step) => step.step)
        .join('\n') || '',
      extendedIngredients: response.data.extendedIngredients?.map((ing) => ({
        id: ing.id,
        original: ing.original,
        amount: ing.amount,
        unit: ing.unit,
      })) || [],
      nutrition: {
        nutrients: response.data.nutrition?.nutrients || [],
      },
      sourceUrl: response.data.sourceUrl,
    };

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe details:', error.response?.data || error.message);
    console.error('Axios Error Details:', error.code, error.config?.url);
    res.status(500).json({
      error: 'Failed to fetch recipe details',
      details: error.response?.data || error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 