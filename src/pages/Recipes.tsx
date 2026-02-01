import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { RecipeCard } from "@/components/custom/RecipeCard";
import { CategoryChips } from "@/components/custom/CategoryChips";
import { useListRecipes } from "@/hooks/useListRecipes";

export default function Recipes() {
  const {
    data: recipes = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useListRecipes();

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const ingredientParam = searchParams.get("ingredient") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam || null,
  );

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((r) =>
        r.category.some((cat) =>
          cat.toLowerCase().includes(selectedCategory.toLowerCase()),
        ),
      );
    }

    // Filter by ingredient
    if (ingredientParam) {
      filtered = filtered.filter((r) =>
        r.ingredientGroups?.some((group) =>
          group.items.some(
            (ing) =>
              ing.name.toLowerCase().includes(ingredientParam.toLowerCase()) ||
              (ing.category && ing.category.toLowerCase().includes(ingredientParam.toLowerCase())),
          ),
        ),
      );
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.ingredientGroups?.some((group) =>
            group.items.some((ing) => ing.name.toLowerCase().includes(query)),
          ),
      );
    }

    return filtered;
  }, [selectedCategory, ingredientParam, searchQuery, recipes]);

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 1 }}
          >
            {ingredientParam ? `${ingredientParam} Recipes` : "All recipes"}
          </Typography>
          <Typography color="text.secondary">
            {filteredRecipes.length} recipes found
          </Typography>
        </Box>

        {/* Search and filters */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            size="small"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{ flex: 1 }}
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
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{
              borderColor: "divider",
              color: "text.primary",
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Category chips */}
        {!ingredientParam && (
          <CategoryChips
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}

        {/* Recipe grid */}
        {filteredRecipes.length > 0 ? (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {filteredRecipes.map((recipe) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No recipes found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
