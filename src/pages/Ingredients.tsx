import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { IngredientCard } from "@/components/custom/IngredientCard";
import { ingredientCategories } from "@/data/recipes";

export default function Ingredients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIngredients = ingredientCategories.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

        {filteredIngredients.length > 0 ? (
          <Grid container spacing={3}>
            {filteredIngredients.map((ingredient) => (
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
