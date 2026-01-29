import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Avatar,
  Button,
  Stack,
  Paper,
  Skeleton,
} from "@mui/material";
import { ChevronLeft as BackIcon } from "@mui/icons-material";
import { useRecipes } from "@/context/RecipeContext";
import { RecipeCard } from "@/components/RecipeCard";

export default function ChefProfile() {
  const { name } = useParams<{ name: string }>();
  const { recipes } = useRecipes();
  
  const decodedName = decodeURIComponent(name || "");
  
  // Find all recipes by this chef
  const chefRecipes = recipes.filter(
    (recipe) => recipe.chef?.name?.toLowerCase() === decodedName.toLowerCase()
  );
  
  // Get chef info from first recipe
  const chefInfo = chefRecipes.length > 0 ? chefRecipes[0].chef : null;

  if (!chefInfo && recipes.length > 0) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" fontFamily='"Fraunces", serif' sx={{ mb: 2 }}>
          Chef not found
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", pb: 6 }}>
      {/* Back button */}
      <Container sx={{ py: 2 }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<BackIcon />}
          sx={{ color: "text.secondary" }}
        >
          Back to recipes
        </Button>
      </Container>

      {/* Chef Header */}
      <Container sx={{ mb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 3,
          }}
        >
          {chefInfo ? (
            <>
              <Avatar
                src={chefInfo.avatar}
                alt={chefInfo.name}
                sx={{ width: 120, height: 120 }}
              />
              <Box textAlign={{ xs: "center", sm: "left" }}>
                <Typography
                  variant="h3"
                  fontFamily='"Fraunces", serif'
                  sx={{ mb: 1 }}
                >
                  {chefInfo.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Recipe creator
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {chefRecipes.length} {chefRecipes.length === 1 ? "Recipe" : "Recipes"}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Skeleton variant="circular" width={120} height={120} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={100} />
              </Box>
            </>
          )}
        </Paper>
      </Container>

      {/* Recipes Grid */}
      <Container>
        <Typography
          variant="h5"
          fontFamily='"Fraunces", serif'
          sx={{ mb: 3 }}
        >
          Recipes by {chefInfo?.name || decodedName}
        </Typography>

        <Grid container spacing={3}>
          {chefRecipes.map((recipe) => (
            <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>

        {chefRecipes.length === 0 && recipes.length > 0 && (
          <Box textAlign="center" py={8}>
            <Typography color="text.secondary">
              No recipes found for this chef.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
