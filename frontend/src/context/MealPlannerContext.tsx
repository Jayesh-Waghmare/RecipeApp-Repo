import React, { createContext, useContext, useState, useEffect } from 'react';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  cuisines: string[];
  dishTypes: string[];
}

export interface MealPlan {
  [date: string]: {
    [meal in MealType]?: Recipe;
  };
}

interface MealPlannerContextType {
  mealPlan: MealPlan;
  addMeal: (date: string, meal: MealType, recipe: Recipe) => void;
  removeMeal: (date: string, meal: MealType) => void;
  getMealForDate: (date: string, meal: MealType) => Recipe | undefined;
}

const MealPlannerContext = createContext<MealPlannerContextType | undefined>(undefined);

export const MealPlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan>({});

  // Load meal plan from localStorage on mount
  useEffect(() => {
    const savedMealPlan = localStorage.getItem('mealPlan');
    if (savedMealPlan) {
      try {
        setMealPlan(JSON.parse(savedMealPlan));
      } catch (error) {
        console.error('Error loading meal plan from localStorage:', error);
      }
    }
  }, []);

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    } catch (error) {
      console.error('Error saving meal plan to localStorage:', error);
    }
  }, [mealPlan]);

  const addMeal = (date: string, meal: MealType, recipe: Recipe) => {
    setMealPlan(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [meal]: recipe
      }
    }));
  };

  const removeMeal = (date: string, meal: MealType) => {
    setMealPlan(prev => {
      const newPlan = { ...prev };
      if (newPlan[date]) {
        const { [meal]: removed, ...rest } = newPlan[date];
        newPlan[date] = rest;
        if (Object.keys(newPlan[date]).length === 0) {
          delete newPlan[date];
        }
      }
      return newPlan;
    });
  };

  const getMealForDate = (date: string, meal: MealType) => {
    return mealPlan[date]?.[meal];
  };

  return (
    <MealPlannerContext.Provider value={{ mealPlan, addMeal, removeMeal, getMealForDate }}>
      {children}
    </MealPlannerContext.Provider>
  );
};

export const useMealPlanner = () => {
  const context = useContext(MealPlannerContext);
  if (context === undefined) {
    throw new Error('useMealPlanner must be used within a MealPlannerProvider');
  }
  return context;
}; 