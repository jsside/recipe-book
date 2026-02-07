import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { IngredientCard } from "@/components/custom/IngredientCard";
import { useListIngredients, IngredientRecord } from "@/hooks/useListIngredients";

export default function Ingredients() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: ingredients = [], isLoading } = useListIngredients();

  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Transform to the shape expected by IngredientCard
  const displayIngredients = filteredIngredients.map((ing: IngredientRecord) => ({
    id: ing.id.toString(),
    name: ing.name,
    image: ing.imageUrl || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    recipeCount: 0, // TODO: Could fetch this from recipe_ingredients junction table
  }));

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, maxWidth: 600 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 1 }}
          >
            Browse by Ingredient
          </Typography>
          <Typography color="text.secondary">
            Find recipes based on what you have in your kitchen. Select an
            ingredient to see all recipes that feature it.
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 4, maxWidth: 400 }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 6,
              bgcolor: "rgba(0, 0, 0, 0.04)",
              "& fieldset": { border: "none" },
            },
          }}
        />

        {isLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : displayIngredients.length > 0 ? (
          <Grid container spacing={3}>
            {displayIngredients.map((ingredient) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={ingredient.id}>
                <IngredientCard ingredient={ingredient} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No ingredients found
            </Typography>
            <Typography color="text.secondary">
              Try a different search term
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
