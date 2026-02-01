import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { RecipeCardProps } from "./interfaces";
import { getRecipeCategories } from "@/utils/recipeHelpers";
import RenderComponent from "@/components/helpers/renderComponent";
import { useShoppingList } from "@/context/ShoppingListContext/utils";

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { addIngredients } = useShoppingList();
  const categories = getRecipeCategories(recipe);

  // Get all ingredients from ingredient groups
  const allIngredients = recipe.ingredientGroups?.flatMap(
    (group) => group.items
  ) || [];

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addIngredients(allIngredients, recipe.id, recipe.title, recipe.image, recipe.servings);
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
        "&:hover .recipe-image": {
          transform: "scale(1.02)",
        },
        background: "transparent",
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={recipe.image}
          alt={recipe.title}
          className="recipe-image"
          sx={{
            aspectRatio: "4/5",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            borderRadius: 2,
          }}
        />

        {/* Badges */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ position: "absolute", top: 12, left: 12 }}
        >
          <RenderComponent
            if={categories.includes("New")}
            then={<Chip label="New" color="success" size="small" />}
          />
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

      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: 1.4,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {recipe.title}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {recipe.category.slice(0, 2).map((cat) => (
            <Chip
              key={cat}
              size="small"
              label={cat}
              variant={"outlined"}
              // onClick={() => onCategoryChange(category)}
              color={"default"}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
