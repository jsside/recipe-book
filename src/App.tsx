import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShoppingListDrawer } from "@/components/ShoppingListDrawer";
import Index from "./pages/Index";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";
import Ingredients from "./pages/Ingredients";
import MealPlans from "./pages/MealPlans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShoppingListProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/ingredients" element={<Ingredients />} />
                <Route path="/meal-plans" element={<MealPlans />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ShoppingListDrawer />
        </BrowserRouter>
      </ShoppingListProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
