// src/RecipeDetailModal.js
import React from "react";
import "./App.css"; // reuse styling

const RecipeDetailModal = ({ isOpen, onClose, recipe, onAddToPlan }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content recipe-detail"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{recipe.title}</h2>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-detail-image"
        />

        {/* Ingredients */}
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)
          ) : (
            <li>No ingredients available</li>
          )}
        </ul>

        {/* Instructions */}
        <h3>Instructions</h3>
        <div className="instructions">
          {recipe.instructions && recipe.instructions.length > 0 ? (
            recipe.instructions.map((step, idx) => <p key={idx}>{step}</p>)
          ) : (
            <p>No instructions available</p>
          )}
        </div>

        {/* ✅ Add to Plan Button */}
        <button
  className="surprise-btn"
  onClick={onAddToPlan}   // ✅ no need to pass recipe again
  style={{ marginTop: "1rem" }}
>
  ➕ Add to Meal Plan
</button>


        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
