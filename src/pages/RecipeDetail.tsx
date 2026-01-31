import { useCallback, useState, useMemo } from "react";
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
  Tab,
  Tabs,
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
  Timer as TimerIcon,
} from "@mui/icons-material";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useUnitConversion } from "@/hooks/useUnitConversion";
import { useServingsAdjuster } from "@/hooks/useServingsAdjuster";
import { useShare } from "@/hooks/useShare";
import {
  parseInstructionWithIngredients,
  getAllIngredients,
} from "@/utils/ingredientParser";
import { getRecipeCategories } from "@/utils/recipeHelpers";
import RenderComponent from "@/components/helpers/renderComponent";
import ServingsAdjuster from "@/components/custom/ServingsAdjuster";
import InstructionStep from "@/components/custom/InstructionStep";
import { useListRecipes } from "@/hooks/useListRecipes";
import { InstructionStep as InstructionStepType } from "@/data/recipes";

export default function RecipeDetail() {
  const { id } = useParams();
  const { data: recipes = [] } = useListRecipes();

  const getRecipeById = useCallback(
    (id: number) => {
      return recipes.find((recipe) => recipe.id === id);
    },
    [recipes]
  );

  const { addIngredients } = useShoppingList();
  const { isActive, toggleWakeLock, isSupported } = useWakeLock();
  const { unitSystem, toggleUnitSystem, convertAmount } = useUnitConversion();
  const { share } = useShare();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const recipe = getRecipeById(parseFloat(id || "0"));

  const {
    adjustedServings,
    incrementServings,
    decrementServings,
    scaleIngredient,
  } = useServingsAdjuster(recipe?.servings || 4);

  // Get all ingredients (supports both legacy and grouped structure)
  const allIngredients = useMemo(() => {
    if (!recipe) return [];
    return getAllIngredients(recipe.ingredientGroups, recipe.ingredients);
  }, [recipe]);

  // Get all instructions (supports both legacy and grouped structure)
  const allInstructions = useMemo(() => {
    if (!recipe) return [];
    if (recipe.instructionGroups && recipe.instructionGroups.length > 0) {
      return recipe.instructionGroups;
    }
    // Legacy support: convert flat instructions to grouped format
    if (recipe.instructions && recipe.instructions.length > 0) {
      return [
        {
          heading: undefined,
          steps: recipe.instructions.map((text) => ({ text, timer: undefined })),
        },
      ];
    }
    return [];
  }, [recipe]);

  // Get all ingredient groups for display
  const ingredientGroups = useMemo(() => {
    if (!recipe) return [];
    if (recipe.ingredientGroups && recipe.ingredientGroups.length > 0) {
      return recipe.ingredientGroups;
    }
    // Legacy support: wrap in single group
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      return [{ heading: undefined, items: recipe.ingredients }];
    }
    return [];
  }, [recipe]);

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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const categories = getRecipeCategories(recipe);
  const hasNutrition = Boolean(
    recipe.nutrition?.calories ||
      recipe.nutrition?.protein ||
      recipe.nutrition?.carbs ||
      recipe.nutrition?.fat
  );

  // Calculate global step number
  let globalStepIndex = 0;

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
                  Add to Shopping List
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
              <Stack spacing={3}>
                {allInstructions.map((group, groupIndex) => (
                  <Box key={groupIndex}>
                    <RenderComponent
                      if={!!group.heading}
                      then={
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ mb: 2, color: "text.primary" }}
                        >
                          {group.heading}
                        </Typography>
                      }
                    />
                    <Stack spacing={1}>
                      {group.steps.map((step, stepIndex) => {
                        const currentGlobalIndex = globalStepIndex++;
                        return (
                          <Box key={stepIndex}>
                            <InstructionStep
                              stepNumber={currentGlobalIndex + 1}
                              instruction={
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="flex-start"
                                  flexWrap="wrap"
                                >
                                  <Box sx={{ flex: 1 }}>
                                    {parseInstructionWithIngredients(
                                      step.text,
                                      allIngredients,
                                      convertAmount,
                                      scaleIngredient
                                    )}
                                  </Box>
                                  <RenderComponent
                                    if={!!step.timer}
                                    then={
                                      <Chip
                                        icon={<TimerIcon />}
                                        label={`${step.timer} min`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ flexShrink: 0 }}
                                      />
                                    }
                                  />
                                </Stack>
                              }
                              isActive={activeStep === currentGlobalIndex}
                              onClick={() =>
                                setActiveStep(
                                  activeStep === currentGlobalIndex
                                    ? null
                                    : currentGlobalIndex
                                )
                              }
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
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
              {/* Tabbed header for Ingredients/Nutrition */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <RenderComponent
                  if={hasNutrition}
                  then={
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      sx={{
                        minHeight: 36,
                        "& .MuiTabs-indicator": {
                          backgroundColor: "text.primary",
                        },
                        "& .MuiTab-root": {
                          minHeight: 36,
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          color: "text.secondary",
                          fontFamily: '"Fraunces", serif',
                          px: 0,
                          mr: 3,
                          "&.Mui-selected": {
                            color: "text.primary",
                          },
                        },
                      }}
                    >
                      <Tab label="Ingredients" />
                      <Tab label="Nutrition" />
                    </Tabs>
                  }
                  else={
                    <Typography variant="h5" fontFamily='"Fraunces", serif'>
                      Ingredients
                    </Typography>
                  }
                />
                <Stack direction="row" spacing={1} alignItems="center">
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

              {/* Tab content */}
              <RenderComponent
                if={activeTab === 0}
                then={
                  <>
                    {/* Servings adjuster */}
                    <Box sx={{ mb: 3 }}>
                      <ServingsAdjuster
                        servings={adjustedServings}
                        onIncrement={incrementServings}
                        onDecrement={decrementServings}
                      />
                    </Box>

                    <Stack spacing={3}>
                      {ingredientGroups.map((group, groupIndex) => (
                        <Box key={groupIndex}>
                          <RenderComponent
                            if={!!group.heading}
                            then={
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                sx={{ mb: 1.5, color: "text.secondary" }}
                              >
                                {group.heading}
                              </Typography>
                            }
                          />
                          <Stack spacing={1}>
                            {group.items.map((ingredient) => {
                              const scaled = scaleIngredient(ingredient);
                              const converted = convertAmount(
                                scaled.amount,
                                scaled.unit
                              );
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
                                  <Box sx={{ flex: 1 }}>
                                    <Typography>
                                      {converted.amount} {converted.unit}{" "}
                                      {ingredient.name}
                                      <RenderComponent
                                        if={!!ingredient.preparation}
                                        then={
                                          <Typography
                                            component="span"
                                            color="text.secondary"
                                          >
                                            , {ingredient.preparation}
                                          </Typography>
                                        }
                                      />
                                    </Typography>
                                    <RenderComponent
                                      if={!!ingredient.note}
                                      then={
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {ingredient.note}
                                        </Typography>
                                      }
                                    />
                                  </Box>
                                </Box>
                              );
                            })}
                          </Stack>
                        </Box>
                      ))}
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
                  </>
                }
              />

              {/* Nutrition tab content */}
              <RenderComponent
                if={activeTab === 1 && hasNutrition}
                then={
                  <Box sx={{ py: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Per serving
                    </Typography>
                    <Stack spacing={2}>
                      <RenderComponent
                        if={!!recipe.nutrition?.calories}
                        then={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              pb: 1.5,
                            }}
                          >
                            <Typography color="text.secondary">
                              Calories
                            </Typography>
                            <Typography fontWeight={500}>
                              {recipe.nutrition?.calories} kcal
                            </Typography>
                          </Box>
                        }
                      />
                      <RenderComponent
                        if={!!recipe.nutrition?.protein}
                        then={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              pb: 1.5,
                            }}
                          >
                            <Typography color="text.secondary">
                              Protein
                            </Typography>
                            <Typography fontWeight={500}>
                              {recipe.nutrition?.protein}g
                            </Typography>
                          </Box>
                        }
                      />
                      <RenderComponent
                        if={!!recipe.nutrition?.carbs}
                        then={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              pb: 1.5,
                            }}
                          >
                            <Typography color="text.secondary">
                              Carbohydrates
                            </Typography>
                            <Typography fontWeight={500}>
                              {recipe.nutrition?.carbs}g
                            </Typography>
                          </Box>
                        }
                      />
                      <RenderComponent
                        if={!!recipe.nutrition?.fat}
                        then={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              pb: 1.5,
                            }}
                          >
                            <Typography color="text.secondary">Fat</Typography>
                            <Typography fontWeight={500}>
                              {recipe.nutrition?.fat}g
                            </Typography>
                          </Box>
                        }
                      />
                    </Stack>
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
