// src/DashboardApp.js
import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, Topbar } from "./Layout";
import SearchView from "./SearchView";
import MealPlanView from "./MealPlanView";
import AddToPlanModal from "./AddToPlanModal";
import RecipeDetailModal from "./RecipeDetailModal";
import Chatbot from "./Components/Chatbot";
import jsPDF from "jspdf";   // ✅ import PDF library
import Portioner from "./Components/Portioner";


function DashboardApp() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [mealPlan, setMealPlan] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [recipeToAdd, setRecipeToAdd] = useState(null);

  // --- Fetch random recipes ---
  const fetchRandomRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const promises = Array.from({ length: 8 }, () =>
        fetch("https://www.themealdb.com/api/json/v1/1/random.php").then((res) =>
          res.json()
        )
      );
      const results = await Promise.all(promises);
      const mapped = results.map((result) => {
        const meal = result.meals[0];
        return {
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          instructions: meal.strInstructions
            ? meal.strInstructions.split("\r\n").filter((s) => s.trim())
            : [],
          ingredients: Array.from({ length: 20 }, (_, i) => i + 1)
            .map((i) =>
              meal[`strIngredient${i}`]
                ? `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`.trim()
                : null
            )
            .filter(Boolean),
        };
      });
      setRecipes(mapped);
    } catch {
      setError("Could not fetch new recipes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomRecipes();
  }, [fetchRandomRecipes]);

  // --- Generate PDF when adding to plan ---
  const generatePDF = (recipe) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(recipe.title, 20, 20);

    doc.setFontSize(14);
    doc.text("Ingredients:", 20, 40);
    let y = 50;
    recipe.ingredients.forEach((ing) => {
      doc.text(`- ${ing}`, 20, y);
      y += 10;
    });

    doc.text("Instructions:", 20, y + 10);
    y += 20;
    recipe.instructions.forEach((step, i) => {
      doc.text(`${i + 1}. ${step}`, 20, y);
      y += 10;
      if (y > 270) { // ✅ page break if content is too long
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${recipe.title}.pdf`);
  };

  // --- Add to plan handler ---
  const handleAddToPlan = (day) => {
    if (!recipeToAdd) return;
    setMealPlan((prev) => ({
      ...prev,
      [day]: [...prev[day], recipeToAdd],
    }));
    generatePDF(recipeToAdd);   // ✅ generate PDF for recipe
    setIsPlanOpen(false);
    setRecipeToAdd(null);
  };

  return (
    <div className="recipe-app">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        fetchRandomRecipes={fetchRandomRecipes}
      />

      <div className="main-content">
        <Topbar currentView={currentView} />
        <div className="content-area">
          {isLoading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* --- Dashboard --- */}
          {!isLoading && recipes.length > 0 && currentView === "dashboard" && (
            <div className="recipe-grid">
              {recipes.map((r) => (
                <div key={r.id} className="recipe-card">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="recipe-card-image"
                    onClick={() => {
                      setSelectedRecipe(r);
                      setIsDetailOpen(true);
                    }}
                  />
                  <h3>{r.title}</h3>
                  <button
                    onClick={() => {
                      setRecipeToAdd(r);
                      setIsPlanOpen(true);
                    }}
                  >
                    Add to Meal Plan
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* --- Search --- */}
          {currentView === "search" && (
            <SearchView
              onSelectRecipe={(recipe) => {
                setSelectedRecipe(recipe);
                setIsDetailOpen(true);
              }}
              onAddToPlan={(recipe) => {
                setRecipeToAdd(recipe);
                setIsPlanOpen(true);
              }}
            />
          )}

          {/* --- Meal Plan --- */}
          {currentView === "meal-plan" && (
            <MealPlanView
              mealPlan={mealPlan}
              onSelectRecipe={(recipe) => {
                setSelectedRecipe(recipe);
                setIsDetailOpen(true);
              }}
              onDeleteRecipe={(day, recipe) =>
                setMealPlan((prev) => ({
                  ...prev,
                  [day]: prev[day].filter((r) => r.id !== recipe.id),
                }))
              }
              onToggleComplete={(day, recipe) =>
                setMealPlan((prev) => ({
                  ...prev,
                  [day]: prev[day].map((r) =>
                    r.id === recipe.id
                      ? { ...r, completed: !r.completed }
                      : r
                  ),
                }))
              }
            />
          )}

          {currentView === "chatbot" && <Chatbot />}
          {currentView === "portioner" && <Portioner />}

        </div>
      </div>

      {/* --- Recipe Detail Modal --- */}
      <RecipeDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        recipe={selectedRecipe}
        onAddToPlan={() => {
          setRecipeToAdd(selectedRecipe);
          setIsPlanOpen(true);
        }}
      />

      {/* --- Add to Meal Plan Modal --- */}
      <AddToPlanModal
        isOpen={isPlanOpen}
        onClose={() => setIsPlanOpen(false)}
        onAddToPlan={handleAddToPlan}
        recipe={recipeToAdd}
      />
    </div>
  );
}

export default DashboardApp;
