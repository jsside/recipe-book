import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { IngredientCategory } from "@/data/recipes";

interface IngredientCardProps {
  ingredient: IngredientCategory;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <Card
      component={Link}
      to={`/recipes?ingredient=${encodeURIComponent(ingredient.name)}`}
      sx={{
        textDecoration: "none",
        display: "block",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px -5px rgba(31, 26, 20, 0.15)",
        },
        "&:hover .ingredient-image": {
          transform: "scale(1.05)",
        },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={ingredient.image}
          alt={ingredient.name}
          className="ingredient-image"
          sx={{
            aspectRatio: "1",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
        />
      </Box>

      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          variant="h6"
          fontFamily='"Fraunces", serif'
          fontWeight={600}
          sx={{ mb: 0.5 }}
        >
          {ingredient.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ingredient.recipeCount} recipes
        </Typography>
      </CardContent>
    </Card>
  );
}
