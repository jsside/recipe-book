import { Link } from "react-router-dom";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { RecipeSneakPeekProps } from "./interfaces";
import { getRecipeCategories } from "@/utils/recipeHelpers";
import { useShoppingList } from "@/context/ShoppingListContext/utils";
import { CloudinaryImage } from "@/components/custom/CloudinaryImage";

export function RecipeSneakPeek({ recipe }: RecipeSneakPeekProps) {
  const { addIngredients } = useShoppingList();
  const categories = getRecipeCategories(recipe);

  // Get all ingredients from ingredient groups
  const allIngredients =
    recipe.ingredientGroups?.flatMap((group) => group.items) || [];

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addIngredients(
      allIngredients,
      recipe.id,
      recipe.title,
      recipe.images?.at(0),
      recipe.servings,
    );
  };

  return (
    <Card
      component={Link}
      to={`/recipe/${recipe.id}`}
      sx={{
        textDecoration: "none",
        display: "block",
        transition: "all 0.2s ease",
        border: "none",
        "&:hover": {
          transform: "translateY(-2px)",
        },
        "&:hover .add-button": {
          opacity: 1,
        },
        background: "transparent",
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {/* TODO [feature]: allow short gifs too */}
        <CloudinaryImage
          src={recipe.images?.at(0) || ""}
          alt={recipe.title}
          width={400}
          height={500}
          className="recipe-image"
          sx={{
            width: "100%",
            aspectRatio: "4/5",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            borderRadius: 1,
          }}
        />

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

      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: 1.4,
            mb: 1,
            overflow: "hidden",
          }}
        >
          {recipe.title}
        </Typography>
        <Typography variant="caption">{recipe.chef.name}</Typography>
      </CardContent>
    </Card>
  );
}
