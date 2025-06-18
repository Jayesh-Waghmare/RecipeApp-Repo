# Recipe App

A full-stack recipe application built with React, Node.js, and the Spoonacular API. This application allows users to search for recipes, view detailed recipe information, and manage their favorite recipes.

## Features

- 🔍 Recipe Search with multiple filters
- 🎲 Random Recipe Discovery
- 📋 Detailed Recipe Information
- ⭐ Favorite Recipe Management
- 📊 Analytics Dashboard
- 🗓️ Meal Planning
- 🎨 Dark/Light Theme Support
- 📱 Responsive Design

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js with Express
- Axios for external API calls
- CORS for cross-origin requests
- Environment variable management

## Project Structure

### Frontend
frontend/
├── src/
│ ├── components/
│ │ ├── FiltersPanel.tsx
│ │ ├── Header.tsx
│ │ ├── IngredientSearch.tsx
│ │ ├── Navbar.tsx
│ │ ├── RecipeCard.tsx
│ │ ├── RecipeDetailModal.tsx
│ │ ├── RecipeGrid.tsx
│ │ ├── SearchBar.tsx
│ │ └── SearchInput.tsx
│ ├── pages/
│ │ ├── AnalyticsPage.tsx
│ │ ├── FavoritesPage.tsx
│ │ ├── HomePage.tsx
│ │ └── MealPlannerPage.tsx
│ ├── services/
│ │ └── recipeService.ts
│ ├── context/
│ ├── types/
│ └── App.tsx
backend/
├── server.js
├── package.json
└── vercel.json

## API Endpoints

### Backend Routes
- `GET /api/recipes/search` - Search recipes with filters
- `GET /api/recipes/random` - Get random recipes
- `GET /api/recipes/:id` - Get detailed recipe information

### Spoonacular API Integration
- Complex Search
- Random Recipes
- Recipe Information
- Recipe Nutrition

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Spoonacular API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   PORT=5001
   SPOONACULAR_API_KEY=your_api_key
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Features Implementation

### Home Page
- Recipe search with filters
- Random recipe discovery
- Recipe cards with basic information
- Detailed recipe modal view

### Favorites Page
- List of saved favorite recipes
- Remove from favorites functionality
- Quick access to recipe details

### Analytics Page
- Recipe search analytics
- Popular cuisines
- Cooking time statistics

### Meal Planner Page
- Plan meals for the week
- Save meal plans
- View planned recipes

### Search and Filters
- Text-based search
- Cuisine filter
- Diet type filter
- Cooking time filter
- Sort options (popularity, time, match)

### Recipe Details
- Recipe title and image
- Cooking time and servings
- Ingredients list
- Step-by-step instructions
- Nutritional information
- Source URL

## Environment Variables

### Backend
- `PORT`: Server port (default: 5001)
- `SPOONACULAR_API_KEY`: Your Spoonacular API key
- `FRONTEND_URL`: Frontend application URL

### Frontend
- `REACT_APP_API_URL`: Backend API URL

## Deployment

The application is configured for deployment on Vercel:

### Backend Deployment
- Configure environment variables in Vercel dashboard
- Set build command: `npm install`
- Set output directory: `.`

### Frontend Deployment
- Configure environment variables in Vercel dashboard
- Set build command: `npm run build`
- Set output directory: `build`

## Notes

- The application uses environment variables for configuration
- API calls are rate-limited by Spoonacular
- Error handling is implemented throughout the application
- The UI is built with accessibility in mind
- Responsive design works on all screen sizes
