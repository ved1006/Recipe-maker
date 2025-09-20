import React, { useState } from "react";
import { Search, Clock, Star } from "lucide-react";

const RecipeCard = ({ recipe, onSelectRecipe, onAddToPlan }) => (
  <div className="recipe-card">
    <div
      className="recipe-card-image-container"
      onClick={() => onSelectRecipe(recipe)}
    >
      <img src={recipe.image} alt={recipe.title} className="recipe-card-image" />
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
      <button onClick={() => onAddToPlan(recipe)}>Add to Meal Plan</button>
    </div>
  </div>
);

const SearchView = ({ onSelectRecipe, onAddToPlan }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();
      if (data.meals) {
        const mappedResults = data.meals.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          instructions: meal.strInstructions
            .split("\r\n")
            .filter((s) => s.trim()),
          ingredients: Array.from({ length: 20 }, (_, i) => i + 1)
            .map((i) =>
              meal[`strIngredient${i}`]
                ? `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`.trim()
                : null
            )
            .filter(Boolean),
        }));
        setResults(mappedResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="search-view">
      <div className="search-header">
        <h1>Search Recipes</h1>
        <p>Find your next favorite meal.</p>
      </div>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g., Chicken, Pasta, Soup..."
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "..." : <Search />}
        </button>
      </div>

      <div className="search-results">
        {isLoading && <p>Searching for recipes...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && searched && results.length === 0 && (
          <p>No recipes found for "{query}". Try another search!</p>
        )}
        <div className="recipe-grid">
          {results.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelectRecipe={onSelectRecipe}
              onAddToPlan={onAddToPlan}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default SearchView;
