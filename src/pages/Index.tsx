import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid, Button } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { HeroSection } from "@/components/HeroSection";
import { CategoryChips } from "@/components/CategoryChips";
import { RecipeCard } from "@/components/RecipeCard";
import { IngredientCard } from "@/components/IngredientCard";
import { useRecipes } from "@/context/RecipeContext";
import { ingredientCategories } from "@/data/recipes";

const Index = () => {
  const { recipes } = useRecipes();
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
      <Box
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
      </Box>

      {/* CTA Section */}
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
            Ready to transform your meal prep?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of home cooks who save time and eat better.
          </Typography>
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 4 }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
