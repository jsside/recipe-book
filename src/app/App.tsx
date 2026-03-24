import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "@/theme/common";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { UnitConversionProvider } from "@/context/UnitConversionContext";
import { Footer } from "@/components/custom/Footer";
import { ShoppingListDrawer } from "@/components/custom/ShoppingListDrawer";
import { NotificationBar } from "@/components/custom/NotificationBar";
import Index from "../pages/Index/index";
import Recipes from "../pages/Recipes";
import Ingredients from "../pages/Ingredients";
import MealPlans from "../pages/MealPlans";
import Auth from "../pages/Auth";
import AddEditRecipeForm from "../pages/AddEditRecipeForm";
import ChefProfile from "../pages/ChefProfile";
import Chefs from "../pages/Chefs";
import NotFound from "../pages/NotFound";
import { QueryClientProvider } from "@tanstack/react-query";
import { singletonQueryClient } from "./App.queries";
import { Navbar } from "@/components/custom/Navbar";
import RecipeDetail from "@/pages/RecipeDetail";
import { I18nProvider } from "@/i18n/I18nProvider";

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <I18nProvider>
      <AuthProvider>
        <NotificationProvider>
          <QueryClientProvider client={singletonQueryClient}>
            <UnitConversionProvider>
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
                    <NotificationBar />
                    <main style={{ flex: 1 }}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/recipe/:id" element={<RecipeDetail />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/ingredients" element={<Ingredients />} />
                        <Route path="/meal-plans" element={<MealPlans />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route
                          path="/add-recipe"
                          element={<AddEditRecipeForm />}
                        />
                        <Route
                          path="/edit-recipe/:id"
                          element={<AddEditRecipeForm />}
                        />
                        <Route path="/chef/:name" element={<ChefProfile />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                  <ShoppingListDrawer />
                </BrowserRouter>
              </ShoppingListProvider>
            </UnitConversionProvider>
          </QueryClientProvider>
        </NotificationProvider>
      </AuthProvider>
    </I18nProvider>
  </ThemeProvider>
);

export default App;
