import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Avatar,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { Add as AddIcon, AccessTime as ClockIcon } from "@mui/icons-material";
import { Recipe } from "@/data/recipes";
import { useShoppingList } from "@/context/ShoppingListContext";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { addIngredients } = useShoppingList();

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addIngredients(recipe.ingredients, recipe.id, recipe.title);
  };

  return (
    <Card
      component={Link}
      to={`/recipe/${recipe.id}`}
      sx={{
        textDecoration: "none",
        display: "block",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px -5px rgba(31, 26, 20, 0.15)",
        },
        "&:hover .add-button": {
          opacity: 1,
        },
        "&:hover .recipe-image": {
          transform: "scale(1.05)",
        },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={recipe.image}
          alt={recipe.title}
          className="recipe-image"
          sx={{
            aspectRatio: "4/3",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
        />

        {/* Badges */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ position: "absolute", top: 12, left: 12 }}
        >
          {recipe.isTopRated && (
            <Chip
              label="Top 50"
              size="small"
              sx={{
                bgcolor: "warning.main",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          )}
        </Stack>

        {/* Add to list button */}
        <IconButton
          className="add-button"
          onClick={handleAddToList}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            opacity: 0,
            transition: "opacity 0.2s ease",
            "&:hover": {
              bgcolor: "white",
            },
          }}
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 600,
            fontSize: "1.1rem",
            lineHeight: 1.3,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {recipe.title}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ mb: 1.5 }}
        >
          <ClockIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {recipe.cookTime}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={recipe.chef.avatar}
            alt={recipe.chef.name}
            sx={{ width: 24, height: 24 }}
          />
          <Typography variant="body2" color="text.secondary">
            {recipe.chef.name}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
