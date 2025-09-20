import React from "react";
import { Calendar, Clock, Star, X, CheckCircle } from "lucide-react";

const RecipeCard = ({ recipe, onSelect, onDelete, onToggleComplete }) => (
  <div className={`recipe-card ${recipe.completed ? "completed" : ""}`}>
    <div
      className="recipe-card-image-container"
      onClick={() => onSelect(recipe)}
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        className="recipe-card-image"
      />
    </div>
    <div className="recipe-card-content">
      <h3>{recipe.title}</h3>
      <div className="recipe-card-info">
        <span>
          <Clock size={16} />
          {recipe.readyInMinutes || "25"} min
        </span>
        <span>
          <Star size={16} />
          {recipe.healthScore || "4.5"}
        </span>
      </div>

      <div className="recipe-card-actions">
        <button
          className="complete-btn"
          onClick={() => onToggleComplete(recipe)}
        >
          <CheckCircle size={16} />
          {recipe.completed ? "Completed" : "Mark Complete"}
        </button>
        <button className="delete-btn" onClick={() => onDelete(recipe)}>
          <X size={16} /> Remove
        </button>
      </div>
    </div>
  </div>
);

const MealPlanView = ({
  mealPlan,
  onSelectRecipe,
  onDeleteRecipe,
  onToggleComplete,
}) => {
  return (
    <main className="meal-plan-view">
      <div className="meal-plan-header">
        <h1>Your Weekly Meal Plan</h1>
        <p>A delicious week, planned just for you.</p>
      </div>
      <div className="meal-plan-grid">
        {Object.keys(mealPlan).map((day) => (
          <div key={day} className="day-section">
            <h2>{day}</h2>
            {mealPlan[day].length > 0 ? (
              <div className="day-recipes">
                {mealPlan[day].map((recipe, index) => (
                  <RecipeCard
                    key={`${recipe.id}-${index}`}
                    recipe={recipe}
                    onSelect={onSelectRecipe}
                    onDelete={() => onDeleteRecipe(day, recipe)}
                    onToggleComplete={() => onToggleComplete(day, recipe)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-day">
                <Calendar size={32} />
                <span>No meals planned.</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default MealPlanView;
