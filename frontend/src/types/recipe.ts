export interface Ingredient {
  id: number;
  original: string;
  amount: number;
  unit: string;
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeStep {
  number: number;
  step: string;
  ingredients: {
    id: number;
    name: string;
  }[];
}

export interface AnalyzedInstruction {
  name: string;
  steps: RecipeStep[];
}

export interface RecipeCardData {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary?: string;
  cuisines: string[];
  diets: string[];
  dishTypes: string[];
  aggregateLikes?: number;
  extendedIngredients?: {
    id: number;
    original: string;
    amount: number;
    unit: string;
  }[];
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary?: string;
  instructions?: string;
  cuisines: string[];
  diets: string[];
  dishTypes: string[];
  aggregateLikes?: number;
  extendedIngredients: {
    id: number;
    original: string;
    amount: number;
    unit: string;
  }[];
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
      }[];
      equipment: {
        id: number;
        name: string;
      }[];
    }[];
  }[];
}

export interface FilterOptions {
  cuisine: string;
  diet: string;
  maxTime: number;
  sortBy: string;
} 