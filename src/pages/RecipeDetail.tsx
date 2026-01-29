import { useCallback, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
  Checkbox,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";
import {
  ChevronLeft as BackIcon,
  Add as AddIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  AccessTime as ClockIcon,
  Scale as ScaleIcon,
  Visibility as WakeLockIcon,
  VisibilityOff as WakeLockOffIcon,
} from "@mui/icons-material";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useUnitConversion } from "@/hooks/useUnitConversion";
import { useServingsAdjuster } from "@/hooks/useServingsAdjuster";
import { parseInstructionWithIngredients } from "@/utils/ingredientParser";
import { getRecipeCategories } from "@/utils/recipeHelpers";
import RenderComponent from "@/components/helpers/renderComponent";
import ServingsAdjuster from "@/components/custom/ServingsAdjuster";
import InstructionStep from "@/components/custom/InstructionStep";
import { useListRecipes } from "@/hooks/useListRecipes";

export default function RecipeDetail() {
  const { id } = useParams();
  const {
    data: recipes = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useListRecipes();

  const getRecipeById = useCallback(
    (id: string) => {
      return recipes.find((recipe) => recipe.id === id);
    },
    [recipes],
  );

  const getRecipesByChef = useCallback(
    (chefName: string) => {
      return recipes.filter(
        (recipe) => recipe.chef?.name?.toLowerCase() === chefName.toLowerCase(),
      );
    },
    [recipes],
  );

  const { addIngredients } = useShoppingList();
  const { isActive, toggleWakeLock, isSupported } = useWakeLock();
  const { unitSystem, toggleUnitSystem, convertAmount } = useUnitConversion();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const recipe = getRecipeById(id || "");

  const {
    adjustedServings,
    incrementServings,
    decrementServings,
    scaleIngredient,
  } = useServingsAdjuster(recipe?.servings || 4);

  if (!recipe) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" fontFamily='"Fraunces", serif' sx={{ mb: 2 }}>
          Recipe not found
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Back to home
        </Button>
      </Container>
    );
  }

  const handleAddAllToList = () => {
    // Scale ingredients before adding
    const scaledIngredients = recipe.ingredients.map((ing) => ({
      ...ing,
      ...scaleIngredient(ing),
    }));
    addIngredients(scaledIngredients, recipe.id, recipe.title);
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
                  if={recipe.isTopRated}
                  then={<Chip label="Top 50" color="warning" size="small" />}
                />
                <RenderComponent
                  if={categories.includes("New recipes")}
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
                  Add to Shopping List
                </Button>
                <IconButton>
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
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper
              elevation={0}
              sx={{ p: 3, bgcolor: "background.paper", borderRadius: 3 }}
            >
              <Typography
                variant="h5"
                fontFamily='"Fraunces", serif'
                sx={{ mb: 3 }}
              >
                Method
              </Typography>
              <Stack spacing={1}>
                {recipe.instructions.map((instruction, index) => (
                  <InstructionStep
                    key={index}
                    stepNumber={index + 1}
                    instruction={parseInstructionWithIngredients(
                      instruction,
                      recipe.ingredients,
                      convertAmount,
                      scaleIngredient,
                    )}
                    isActive={activeStep === index}
                    onClick={() =>
                      setActiveStep(activeStep === index ? null : index)
                    }
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Ingredients (Right) */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 3,
                position: { lg: "sticky" },
                top: { lg: 100 },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h5" fontFamily='"Fraunces", serif'>
                  Ingredients
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* Unit toggle */}
                  <Chip
                    label={unitSystem}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "capitalize" }}
                  />

                  <Tooltip
                    title={`Switch to ${unitSystem === "metric" ? "imperial" : "metric"}`}
                  >
                    <IconButton onClick={toggleUnitSystem} size="small">
                      <ScaleIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Wake lock toggle */}
                  <RenderComponent
                    if={isSupported}
                    then={
                      <Tooltip
                        title={
                          isActive ? "Screen will stay on" : "Keep screen awake"
                        }
                      >
                        <IconButton
                          onClick={toggleWakeLock}
                          size="small"
                          color={isActive ? "primary" : "default"}
                        >
                          <RenderComponent
                            if={isActive}
                            then={<WakeLockIcon />}
                            else={<WakeLockOffIcon />}
                          />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                </Stack>
              </Stack>

              {/* Servings adjuster */}
              <Box sx={{ mb: 3 }}>
                <ServingsAdjuster
                  servings={adjustedServings}
                  onIncrement={incrementServings}
                  onDecrement={decrementServings}
                />
              </Box>

              <Stack spacing={1}>
                {recipe.ingredients.map((ingredient) => {
                  const scaled = scaleIngredient(ingredient);
                  const converted = convertAmount(scaled.amount, scaled.unit);
                  return (
                    <Box
                      key={ingredient.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                      }}
                    >
                      <Checkbox size="small" />
                      <Typography>
                        {converted.amount} {converted.unit} {ingredient.name}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddAllToList}
                sx={{ mt: 3 }}
              >
                Add all to list
              </Button>

              {/* Nutrition info */}
              <RenderComponent
                if={!!recipe.nutrition}
                then={
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Nutrition per serving
                    </Typography>
                    <Grid container spacing={1}>
                      <RenderComponent
                        if={!!recipe.nutrition?.calories}
                        then={
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Calories
                            </Typography>
                            <Typography fontWeight={500}>
                              {recipe.nutrition?.calories}
                            </Typography>
                          </Grid>
                        }
                      />
                      <RenderComponent
                        if={!!recipe.nutrition?.protein}
                        then={
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Protein
                            </Typography>
                            <Typography fontWeight={500}>
                              {recipe.nutrition?.protein}g
                            </Typography>
                          </Grid>
                        }
                      />
                      <RenderComponent
                        if={!!recipe.nutrition?.carbs}
                        then={
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Carbs
                            </Typography>
                            <Typography fontWeight={500}>
                              {recipe.nutrition?.carbs}g
                            </Typography>
                          </Grid>
                        }
                      />
                      <RenderComponent
                        if={!!recipe.nutrition?.fat}
                        then={
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Fat
                            </Typography>
                            <Typography fontWeight={500}>
                              {recipe.nutrition?.fat}g
                            </Typography>
                          </Grid>
                        }
                      />
                    </Grid>
                  </Box>
                }
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
