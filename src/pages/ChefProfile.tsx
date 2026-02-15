import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Avatar,
  Button,
  Paper,
  Skeleton,
  IconButton,
} from "@mui/material";
import { ChevronLeft as BackIcon, Edit as EditIcon } from "@mui/icons-material";

import { RecipeCard } from "@/components/custom/RecipeCard";
import { useListRecipesByChefName } from "@/hooks/useListRecipes";
import { useAuth } from "@/context/AuthContext/utils";
import RenderComponent from "@/components/helpers/renderComponent";
import { useI18n } from "@/i18n/useI18n";

export default function ChefProfile() {
  const i18n = useI18n();
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name || "");

  const { data, isLoading } = useListRecipesByChefName(decodedName);

  const chefInfo = data?.chef;
  const chefRecipes = data?.recipes || [];

  // Check if current user can edit this profile
  const { user } = useAuth();
  const canEdit = user && data && user?.name === data.chef.name;

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", pb: 6 }}>
        <Container sx={{ py: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<BackIcon />}
            sx={{ color: "text.secondary" }}
          >
            {i18n.backToRecipes}
          </Button>
        </Container>
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
            <Skeleton variant="circular" width={120} height={120} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={100} />
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!chefInfo) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {i18n.chefNotFound}
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          {i18n.backToHome}
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
          {i18n.backToRecipes}
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
          <Avatar
            src={chefInfo.avatar}
            alt={chefInfo.name}
            sx={{ width: 120, height: 120 }}
          />
          <Box textAlign={{ xs: "center", sm: "left" }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {chefInfo.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {i18n.recipeCreator}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {chefRecipes.length}{" "}
              {chefRecipes.length === 1 ? "Recipe" : "Recipes"}
            </Typography>
          </Box>

          <RenderComponent
            if={canEdit}
            then={
              <Box>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Box>
            }
          />
        </Paper>
      </Container>

      {/* Recipes Grid */}
      <Container>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {i18n.recipesByChef({ name: chefInfo.name })}
        </Typography>

        <Grid container spacing={3}>
          {chefRecipes.map((recipe) => (
            <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>

        {chefRecipes.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography color="text.secondary">{i18n.emptyRecipes}</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
