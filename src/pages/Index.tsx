import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid, Button } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { HeroSection } from "@/components/custom/HeroSection";
import { CategoryChips } from "@/components/custom/CategoryChips";
import { RecipeCard } from "@/components/custom/RecipeCard";
import { IngredientCard } from "@/components/custom/IngredientCard";
import { ingredientCategories } from "@/data/recipes";
import { useListRecipes } from "@/hooks/useListRecipes";
import RenderComponent from "@/components/helpers/renderComponent";
import { Features } from "@/features";

const Index = () => {
  const {
    data: recipes = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useListRecipes();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    if (!selectedCategory) {
      return recipes.filter((r) => r.category.includes("Dinner"));
    }
    return recipes.filter((r) =>
      r.category.some((cat) =>
        cat
          .toLowerCase()
          .includes(selectedCategory.toLowerCase().replace(", sorted", "")),
      ),
    );
  }, [selectedCategory, recipes]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <HeroSection />

      {/* Recipe Section */}
      <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <CategoryChips
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {filteredRecipes.slice(0, 10).map((recipe) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              component={Link}
              to="/recipes"
              variant="outlined"
              endIcon={<ArrowIcon />}
              sx={{
                borderColor: "text.primary",
                color: "text.primary",
                px: 4,
              }}
            >
              View all recipes
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Ingredients Section */}
        <RenderComponent
        if={Features["feature-recipe-by-ingredient"]}
        then={ <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 1 }}
              >
                Browse by Ingredient
              </Typography>
              <Typography color="text.secondary">
                Find recipes based on what you have in your kitchen
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/ingredients"
              endIcon={<ArrowIcon />}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              View all
            </Button>
          </Box>

          <Grid container spacing={3}>
            {ingredientCategories.slice(0, 8).map((ingredient) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={ingredient.id}>
                <IngredientCard ingredient={ingredient} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>}
        />
     

      {/* Chefs Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          bgcolor: "primary.main",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              mb: 3,
            }}
          >
            Highlighted chefs
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Meet the chefs
          </Typography>
        {/* TODO: add scrollable chefs list */}
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
