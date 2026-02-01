import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import {
  ChevronLeft as BackIcon,
  Add as AddIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import { useServingsAdjuster } from "@/hooks/useServingsAdjuster";
import { useShare } from "@/hooks/useShare";
import { getAllIngredients } from "@/utils/ingredientParser";
import { getRecipeCategories } from "@/utils/recipeHelpers";
import RenderComponent from "@/components/helpers/renderComponent";
import { IngredientsNutrientsPanel } from "./components/IngredientsNutrientsPanel";
import { MethodPanel } from "./components/MethodPanel";
import { useGetRecipe } from "@/hooks/useGetRecipe";
import { useShoppingList } from "@/context/ShoppingListContext/utils";

export default function RecipeDetail() {
  const { id } = useParams();
  const { data: recipe } = useGetRecipe(id);
  const { addIngredients } = useShoppingList();
  const { share } = useShare();

  const { scaleIngredient } = useServingsAdjuster(recipe?.servings || 4);

  // Get all ingredients
  const allIngredients = useMemo(() => {
    if (!recipe) return [];
    return getAllIngredients(recipe.ingredientGroups);
  }, [recipe]);

  if (!recipe) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Recipe not found
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Back to home
        </Button>
      </Container>
    );
  }

  const handleAddAllToList = () => {
    const scaledIngredients = allIngredients.map((ing) => ({
      ...ing,
      ...scaleIngredient(ing),
    }));
    addIngredients(scaledIngredients, recipe.id, recipe.title);
  };

  const handleShare = () => {
    share({
      title: recipe.title,
      text: recipe.description,
      url: window.location.href,
    });
  };

  const categories = getRecipeCategories(recipe);

  return (
    <Box sx={{ minHeight: "100vh", pb: 6 }}>
      {/* Back button */}
      <Container sx={{ py: 2 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<BackIcon />}
          sx={{ color: "text.secondary" }}
        >
          Back to recipes
        </Button>
      </Container>

      {/* Hero section */}
      <Container>
        <Grid container spacing={4}>
          {/* Image */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              component="img"
              src={recipe.image}
              alt={recipe.title}
              sx={{
                width: "100%",
                aspectRatio: "4/3",
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          </Grid>

          {/* Content */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={3}>
              {/* Badges */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <RenderComponent
                  if={categories.includes("New")}
                  then={<Chip label="New" color="success" size="small" />}
                />
                <RenderComponent
                  if={!!recipe.difficulty}
                  then={
                    <Chip
                      label={recipe.difficulty}
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  }
                />
                {recipe.dietaryTags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                ))}
              </Stack>

              <Typography
                variant="h1"
                sx={{ fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" } }}
              >
                {recipe.title}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.1rem" }}
              >
                {recipe.description}
              </Typography>

              {/* Cook time */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <ClockIcon sx={{ color: "text.secondary" }} />
                <Typography color="text.secondary">
                  {recipe.cookTime} cook
                </Typography>
              </Stack>

              {/* Chef info - clickable */}
              <Stack
                component={Link}
                to={`/chef/${encodeURIComponent(recipe.chef.name)}`}
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  p: 1.5,
                  mx: -1.5,
                  borderRadius: 2,
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Avatar src={recipe.chef.avatar} alt={recipe.chef.name} />
                <Box>
                  <Typography fontWeight={500}>{recipe.chef.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recipe creator
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={handleAddAllToList}
                >
                  Add to shopping list
                </Button>
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
                <IconButton onClick={() => window.print()}>
                  <PrintIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Method and Ingredients - Side by Side */}
      <Container sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* Method (Left) */}
          <MethodPanel recipe={recipe} />

          {/* Ingredients (Right) */}
          <IngredientsNutrientsPanel recipe={recipe} />
        </Grid>
      </Container>
    </Box>
  );
}
