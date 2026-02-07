import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid, Button } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { HeroSection } from "./components/HeroSection";
import { CategoryChips } from "@/components/custom/CategoryChips";
import { RecipeCard } from "@/components/custom/RecipeCard";
import { IngredientCard } from "@/components/custom/IngredientCard";
import { ingredientCategories, Recipe } from "@/data/recipes";
import { useListRecipes } from "@/hooks/useListRecipes";
import RenderComponent from "@/components/helpers/renderComponent";
import ChefCard from "./components/ChefCard";
import { Features } from "@/features";
import { isNew } from "@/utils/recipeHelpers";
import { HorizontalScrollRail } from "@/components/custom/HorizontalScrollRail";

const Index = () => {
  const { data: recipes = [] } = useListRecipes();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <HeroSection />
      <LatestRecipesScrollable recipes={recipes} />
      <RecipesSection recipes={recipes} />
      <ChefsScrollable recipes={recipes} />
      <RenderComponent
        if={Features["feature-recipe-by-ingredient"]}
        then={<IngredientsSection />}
      />
    </Box>
  );
};

/**
 * 1. Latest recipes - Horizontal scroll
 */
const LatestRecipesScrollable = ({ recipes }: { recipes: Recipe[] }) => {
  // Get latest recipes (added within last 30 days, sorted by newest first)
  const latestRecipes = useMemo(() => {
    return recipes
      .filter((r) => isNew(r))
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 10);
  }, [recipes]);

  return (
    <RenderComponent
      if={latestRecipes.length > 0}
      then={
        <Box
          component="section"
          sx={{
            py: { xs: 4, md: 6 },
            position: "relative",
            left: "50%",
            right: "50%",
            ml: "-50vw",
            mr: "-50vw",
            width: "100vw",
          }}
        >
          {/* Title aligned with main content */}
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mb: 1 }}
            >
              Latest recipes
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Fresh from our kitchen
            </Typography>
          </Container>
          <HorizontalScrollRail>
            {latestRecipes.map((recipe) => (
              <Box
                key={recipe.id}
                sx={{
                  flexShrink: 0,
                  width: { xs: 260, sm: 280, md: 300 },
                  scrollSnapAlign: "start",
                }}
              >
                <RecipeCard recipe={recipe} />
              </Box>
            ))}
          </HorizontalScrollRail>
        </Box>
      }
    />
  );
};

/**
 * 2. Recipe section
 */
const RecipesSection = ({ recipes }: { recipes: Recipe[] }) => {
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
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mb: 3 }}
        >
          Browse recipes
        </Typography>

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
  );
};

/**
 * 3. Chefs - Horizontal scroll
 */
const ChefsScrollable = ({ recipes }: { recipes: Recipe[] }) => {
  // Get unique chefs with recipe counts
  const chefs = useMemo(() => {
    const chefMap = new Map<
      string,
      { name: string; avatar: string; recipeCount: number }
    >();

    recipes.forEach((recipe) => {
      if (recipe.chef?.name) {
        const existing = chefMap.get(recipe.chef.name);
        if (existing) {
          existing.recipeCount++;
        } else {
          chefMap.set(recipe.chef.name, {
            name: recipe.chef.name,
            avatar: recipe.chef.avatar,
            recipeCount: 1,
          });
        }
      }
    });

    return Array.from(chefMap.values()).sort(
      (a, b) => b.recipeCount - a.recipeCount,
    );
  }, [recipes]);

  return (
    <RenderComponent
      if={chefs.length > 0}
      then={
        <Box
          component="section"
          sx={{
            py: { xs: 4, md: 6 },
            position: "relative",
            left: "50%",
            right: "50%",
            ml: "-50vw",
            mr: "-50vw",
            width: "100vw",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mb: 1 }}
            >
              Meet the chefs
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Our recipe creators
            </Typography>
          </Container>
          <HorizontalScrollRail>
            {chefs.map((chef) => (
              <Box
                key={chef.name}
                sx={{
                  flexShrink: 0,
                  width: 140,
                  scrollSnapAlign: "start",
                }}
              >
                <ChefCard chef={chef} />
              </Box>
            ))}
          </HorizontalScrollRail>
        </Box>
      }
    />
  );
};

/**
 * 4. Ingredients section - UNDER FAC
 */
const IngredientsSection = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "background.default",
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
              Browse by ingredient
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
  );
};

export default Index;
