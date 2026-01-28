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
  People as PeopleIcon,
  Scale as ScaleIcon,
  Visibility as WakeLockIcon,
  VisibilityOff as WakeLockOffIcon,
} from "@mui/icons-material";
import { useRecipes } from "@/context/RecipeContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useUnitConversion } from "@/hooks/useUnitConversion";

export default function RecipeDetail() {
  const { id } = useParams();
  const { getRecipeById } = useRecipes();
  const { addIngredients } = useShoppingList();
  const { isActive, toggleWakeLock, isSupported } = useWakeLock();
  const { unitSystem, toggleUnitSystem, convertAmount } = useUnitConversion();

  const recipe = getRecipeById(id || "");

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
    addIngredients(recipe.ingredients, recipe.id, recipe.title);
  };

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
              <Stack direction="row" spacing={1}>
                {recipe.isTopRated && (
                  <Chip label="Top 50" color="warning" size="small" />
                )}
                {recipe.difficulty && (
                  <Chip
                    label={recipe.difficulty}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                )}
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

              <Stack direction="row" spacing={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ClockIcon sx={{ color: "text.secondary" }} />
                  <Typography color="text.secondary">
                    {recipe.cookTime}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PeopleIcon sx={{ color: "text.secondary" }} />
                  <Typography color="text.secondary">
                    {recipe.servings} servings
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
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
              <Stack spacing={3}>
                {recipe.instructions.map((instruction, index) => (
                  <Stack key={index} direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography sx={{ pt: 0.5, fontSize: "1.1rem" }}>
                      {instruction}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {/* Tips section */}
              {recipe.tips && (
                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 3 }} />
                  <Typography
                    variant="h6"
                    fontFamily='"Fraunces", serif'
                    sx={{ mb: 2 }}
                  >
                    Chef's Tips
                  </Typography>
                  <Typography color="text.secondary">{recipe.tips}</Typography>
                </Box>
              )}
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
                  <Tooltip
                    title={`Switch to ${unitSystem === "metric" ? "imperial" : "metric"}`}
                  >
                    <IconButton onClick={toggleUnitSystem} size="small">
                      <ScaleIcon />
                    </IconButton>
                  </Tooltip>
                  <Chip
                    label={unitSystem}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "capitalize" }}
                  />

                  {/* Wake lock toggle */}
                  {isSupported && (
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
                        {isActive ? <WakeLockIcon /> : <WakeLockOffIcon />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {recipe.servings} servings
              </Typography>

              <Stack spacing={1}>
                {recipe.ingredients.map((ingredient) => {
                  const converted = convertAmount(
                    ingredient.amount,
                    ingredient.unit,
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
              {recipe.nutrition && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Nutrition per serving
                  </Typography>
                  <Grid container spacing={1}>
                    {recipe.nutrition.calories && (
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Calories
                        </Typography>
                        <Typography fontWeight={500}>
                          {recipe.nutrition.calories}
                        </Typography>
                      </Grid>
                    )}
                    {recipe.nutrition.protein && (
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Protein
                        </Typography>
                        <Typography fontWeight={500}>
                          {recipe.nutrition.protein}g
                        </Typography>
                      </Grid>
                    )}
                    {recipe.nutrition.carbs && (
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Carbs
                        </Typography>
                        <Typography fontWeight={500}>
                          {recipe.nutrition.carbs}g
                        </Typography>
                      </Grid>
                    )}
                    {recipe.nutrition.fat && (
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Fat
                        </Typography>
                        <Typography fontWeight={500}>
                          {recipe.nutrition.fat}g
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
