import React, { useState } from 'react';
import { useMealPlanner, MealType } from '../context/MealPlannerContext';

const MealPlannerPage: React.FC = () => {
  const { mealPlan, addMeal, removeMeal } = useMealPlanner();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Generate dates for the current week
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const handleMealSlotClick = (date: string, meal: MealType) => {
    setSelectedDate(date);
    setSelectedMeal(meal);
    setShowRecipeModal(true);
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Meal Planner</h1>
        <p className="text-gray-600 dark:text-gray-400">Plan your meals for the week</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Weekly Schedule</h2>
          <div className="space-y-4">
            {weekDates.map((date) => (
              <div key={date} className="border-b dark:border-gray-700 pb-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((meal) => (
                    <div
                      key={meal}
                      className={`p-3 rounded-lg cursor-pointer ${
                        selectedDate === date && selectedMeal === meal
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                      onClick={() => handleMealSlotClick(date, meal)}
                    >
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize mb-2">
                        {meal}
                      </h4>
                      {mealPlan[date]?.[meal] ? (
                        <div className="relative group">
                          <div className="text-sm text-gray-800 dark:text-gray-200">
                            {mealPlan[date][meal]?.title}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMeal(date, meal);
                            }}
                            className="absolute top-0 right-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">Click to add meal</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </main>
  );
};

export default MealPlannerPage; 