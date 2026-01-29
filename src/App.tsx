import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "@/theme/common";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import { AuthProvider } from "@/context/AuthContext";
import { RecipeProvider } from "@/context/RecipeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShoppingListDrawer } from "@/components/ShoppingListDrawer";
import Index from "./pages/Index";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";
import Ingredients from "./pages/Ingredients";
import MealPlans from "./pages/MealPlans";
import Auth from "./pages/Auth";
import AddRecipe from "./pages/AddRecipe";
import ChefProfile from "./pages/ChefProfile";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <RecipeProvider>
        <ShoppingListProvider>
          <BrowserRouter>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/ingredients" element={<Ingredients />} />
                  <Route path="/meal-plans" element={<MealPlans />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/add-recipe" element={<AddRecipe />} />
                  <Route path="/chef/:name" element={<ChefProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <ShoppingListDrawer />
          </BrowserRouter>
        </ShoppingListProvider>
      </RecipeProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
