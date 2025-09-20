  // src/App.js
  import React, { useState, useEffect, useCallback } from "react";
  import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
  import { Search, Calendar, Home, Bell, ChefHat, Bookmark, MessageCircle } from "lucide-react";
  import "./App.css";
  import Chatbot from "./Components/Chatbot";
  import { getAuth, signOut } from "firebase/auth";
  import { useNavigate } from "react-router-dom";
  import Portioner from "./Components/Portioner";



  // Minithon Components
  import SearchView from "./SearchView";
  import MealPlanView from "./MealPlanView";
  import AddToPlanModal from "./AddToPlanModal";

  // Firebase Auth Components
  import AuthNavbar from "./Components/AuthNavbar";
  import LandingPage from "./Components/LandingPage";
  import Login from "./Components/Login";
  import SignUp from "./Components/SignUp";
  import ForgotPassword from "./Components/ForgotPassword";
  import RecipeScaler from "./Components/RecipeScaler";

  /* ========= Recipe Detail Modal ========= */
  const RecipeDetailModal = ({ isOpen, onClose, recipe }) => {
    if (!isOpen || !recipe) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content recipe-detail" onClick={(e) => e.stopPropagation()}>
          <h2>{recipe.title}</h2>
          <img src={recipe.image} alt={recipe.title} />

          {/* Ingredients */}
          {recipe.ingredients && (
            <>
              <h3>Ingredients:</h3>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </>
          )}

          {/* Instructions */}
          {recipe.instructions && (
            <>
              <h3>Instructions:</h3>
              <ul className="instructions-list">
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </>
          )}

          <button className="modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  /* ========= Sidebar ========= */
  const NavItem = ({ icon, label, view, currentView, onClick }) => (
    <button
      className={`nav-item ${currentView === view ? "active" : ""}`}
      onClick={() => onClick(view)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const Sidebar = ({ currentView, setCurrentView, fetchRandomRecipes }) => {
    const handleNavClick = (view) => {
      if (view === "dashboard" && currentView !== "dashboard") {
        fetchRandomRecipes();
      }
      setCurrentView(view);
    };

    return (
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-container"><ChefHat /></div>
          <span className="sidebar-title">Cooksy</span>
        </div>
        <nav>
          <NavItem icon={<Home />} label="Home" view="dashboard" onClick={handleNavClick} currentView={currentView} />
          <NavItem icon={<Search />} label="Search" view="search" onClick={handleNavClick} currentView={currentView} />
          <NavItem icon={<Calendar />} label="Meal Plan" view="meal-plan" onClick={handleNavClick} currentView={currentView} />
          <NavItem icon={<MessageCircle />} label="AI Assistant" view="chatbot" onClick={handleNavClick} currentView={currentView} />
        

        </nav>
      </aside>
    );
  };

  /* ========= Topbar ========= */
  const Topbar = ({ currentView }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
      navigate("/login");   // ✅ Redirect to login page
    };

    return (
      <header className="navbar">
        <h1 className="navbar-title">
          {currentView.replace("-", " ").replace(/\b\w/g, (l) =>
            l.toUpperCase()
          )}
        </h1>
        <div className="navbar-actions">
          <button className="login-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
    );
  };

  /* ========= Dashboard ========= */
  function DashboardApp() {
    const [currentView, setCurrentView] = useState("dashboard");
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const [recipeToAdd, setRecipeToAdd] = useState(null);

    const [selectedRecipe, setSelectedRecipe] = useState(null); // ✅ detail modal state

    const [mealPlan, setMealPlan] = useState({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    });

    // Fetch random recipes
    const fetchRandomRecipes = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promises = Array.from({ length: 8 }, () =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php").then((res) => res.json())
        );
        const results = await Promise.all(promises);
        const mapped = results.map((result) => {
          const meal = result.meals[0];
          return {
            id: meal.idMeal,
            title: meal.strMeal,
            image: meal.strMealThumb,
            instructions: meal.strInstructions ? meal.strInstructions.split("\r\n").filter((s) => s.trim()) : [],
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

    // Handlers
    const handleAddToPlan = (day) => {
      setMealPlan((prev) => ({
        ...prev,
        [day]: [...prev[day], recipeToAdd],
      }));
      setIsPlanOpen(false);
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

            {/* Dashboard */}
            {!isLoading && recipes.length > 0 && currentView === "dashboard" && (
              <div className="recipe-grid">
                {recipes.map((r) => (
                  <div key={r.id} className="recipe-card">
                    <img
                      src={r.image}
                      alt={r.title}
                      className="recipe-card-image"
                      onClick={() => setSelectedRecipe(r)} // ✅ open details
                    />
                    <h3 onClick={() => setSelectedRecipe(r)}>{r.title}</h3>
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

            {/* Search */}
            {currentView === "search" && (
              <SearchView
                onSelectRecipe={(recipe) => setSelectedRecipe(recipe)} // ✅ open details
                onAddToPlan={(recipe) => {
                  setRecipeToAdd(recipe);
                  setIsPlanOpen(true);
                }}
              />
            )}

            {/* Meal Plan */}
            {currentView === "meal-plan" && (
              <MealPlanView
                mealPlan={mealPlan}
                onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
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
                      r.id === recipe.id ? { ...r, completed: !r.completed } : r
                    ),
                  }))
                }
              />
            )}

            {currentView === "chatbot" && <Chatbot />}
            {currentView === "my-recipes" && <p>My Recipes Coming Soon!</p>}
          </div>
        </div>

        {/* Add To Plan Modal */}
        <AddToPlanModal
          isOpen={isPlanOpen}
          onClose={() => setIsPlanOpen(false)}
          onAddToPlan={handleAddToPlan}
          recipe={recipeToAdd}
        />

        {/* Recipe Detail Modal */}
        <RecipeDetailModal
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          recipe={selectedRecipe}
        />
      </div>
    );
  }

  /* ========= Root App ========= */
  function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
      <Router>
        <Routes>

          <Route path="/" element={<><AuthNavbar /><LandingPage /></>} />
          <Route path="/login" element={<><AuthNavbar /><Login setIsLoggedIn={setIsLoggedIn} /></>} />
          <Route path="/signup" element={<><AuthNavbar /><SignUp setIsLoggedIn={setIsLoggedIn} /></>} />
          <Route path="/forgot-password" element={<><AuthNavbar /><ForgotPassword /></>} />
          <Route path="/scaler" element={<><AuthNavbar /><RecipeScaler /></>} />
          <Route path="/dashboard" element={isLoggedIn ? <DashboardApp /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  export default App;
