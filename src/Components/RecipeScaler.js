import { useState } from "react";
import "./../App.css";
import "./Auth/auth.css";   // ✅ correct relative path



export default function RecipeScaler() {
  const [originalServings, setOriginalServings] = useState(2);
  const [desiredServings, setDesiredServings] = useState(2);

  // Example recipe (could later be dynamic from database / AI)
  const ingredients = [
    { name: "Rice", quantity: 200, unit: "g" },
    { name: "Onion", quantity: 1, unit: "piece" },
    { name: "Water", quantity: 2, unit: "cups" },
  ];

  // Scale ingredients based on serving size
  const scaledIngredients = ingredients.map((item) => {
    const newQty =
      (desiredServings / originalServings) * item.quantity;
    return { ...item, quantity: newQty };
  });

  return (
    <div className="form-container">
      <h2>Recipe Scaling Calculator</h2>
      <form className="scaler-form">
        <label>Original Servings:</label>
        <input
          type="number"
          value={originalServings}
          onChange={(e) => setOriginalServings(e.target.value)}
          min="1"
        />

        <label>Desired Servings:</label>
        <input
          type="number"
          value={desiredServings}
          onChange={(e) => setDesiredServings(e.target.value)}
          min="1"
        />
      </form>

      <h3>Scaled Ingredients</h3>
      <ul>
        {scaledIngredients.map((item, index) => (
          <li key={index}>
            {item.name}: <strong>{item.quantity.toFixed(2)} {item.unit}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
