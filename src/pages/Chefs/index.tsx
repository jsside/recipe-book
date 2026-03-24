import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Container,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useListChefs } from "@/hooks/useListChefs";
import { useListRecipesByChefName } from "@/hooks/useListRecipes";
import { RecipeCard } from "@/components/custom/RecipeCard";

export default function Chefs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: chefs = [], isLoading: chefsLoading } = useListChefs();

  // Selected chef from URL or first chef
  const selectedName = searchParams.get("chef") || chefs[0]?.name || "";

  const handleSelectChef = (name: string) => {
    setSearchParams({ chef: name });
  };

  const { data: chefData, isLoading: recipesLoading } =
    useListRecipesByChefName(selectedName);

  const selectedChef = useMemo(
    () => chefs.find((c) => c.name === selectedName),
    [chefs, selectedName],
  );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Typography variant="h4" sx={{ mb: 1 }}>
          Our Chefs
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Meet the recipe creators behind the dishes you love.
        </Typography>

        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Side Nav - Desktop */}
          {!isMobile && (
            <Box
              sx={{
                width: 260,
                flexShrink: 0,
                position: "sticky",
                top: 100,
                alignSelf: "flex-start",
                maxHeight: "calc(100vh - 140px)",
                overflow: "auto",
              }}
            >
              <Typography
                variant="overline"
                sx={{ px: 2, mb: 1, display: "block", color: "text.secondary" }}
              >
                Our Chefs
              </Typography>
              {chefsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1 }}
                  >
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={120} />
                  </Box>
                ))
              ) : (
                <List disablePadding>
                  {chefs.map((chef) => (
                    <ListItemButton
                      key={chef.id}
                      selected={chef.name === selectedName}
                      onClick={() => handleSelectChef(chef.name)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        "&.Mui-selected": {
                          bgcolor: "action.selected",
                        },
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 48 }}>
                        <Avatar
                          src={chef.avatar}
                          alt={chef.name}
                          sx={{ width: 36, height: 36 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={chef.name}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: chef.name === selectedName ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Mobile chef selector */}
            {isMobile && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  value={selectedName}
                  onChange={(e) => handleSelectChef(e.target.value)}
                  size="small"
                  displayEmpty
                  renderValue={(value) => value || "Select a chef"}
                >
                  {chefs.map((chef) => (
                    <MenuItem key={chef.id} value={chef.name}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={chef.avatar}
                          alt={chef.name}
                          sx={{ width: 28, height: 28 }}
                        />
                        {chef.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Chef header */}
            {selectedChef && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  mb: 4,
                }}
              >
                <Avatar
                  src={selectedChef.avatar}
                  alt={selectedChef.name}
                  sx={{ width: 80, height: 80 }}
                />
                <Box>
                  <Typography variant="h5">{selectedChef.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chefData?.recipes.length ?? 0}{" "}
                    {(chefData?.recipes.length ?? 0) === 1 ? "recipe" : "recipes"}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Recipes grid */}
            {recipesLoading ? (
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton
                      variant="rounded"
                      height={280}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {(chefData?.recipes ?? []).map((recipe) => (
                  <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <RecipeCard recipe={recipe} />
                  </Grid>
                ))}
              </Grid>
            )}

            {!recipesLoading && (chefData?.recipes ?? []).length === 0 && selectedName && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography color="text.secondary">
                  No recipes found for this chef.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
