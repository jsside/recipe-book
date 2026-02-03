import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { RecipeListItemProps } from "./interfaces";
import { CloudinaryImage } from "@/components/custom/CloudinaryImage";

export function RecipeListItem({
  recipe,
  onAdjustServings,
  onRemove,
}: RecipeListItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdjust = () => {
    handleMenuClose();
    onAdjustServings(recipe);
  };

  const handleRemove = () => {
    handleMenuClose();
    onRemove(recipe.recipeId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.5,
        borderBottom: 1,
        borderColor: "divider",
        "&:last-child": { borderBottom: 0 },
      }}
    >
      <CloudinaryImage
        src={recipe.recipeImage || ""}
        alt={recipe.recipeTitle}
        width={56}
        height={56}
        sx={{
          width: 56,
          height: 56,
          borderRadius: 1,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {recipe.recipeTitle}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
          {recipe.servings !== recipe.originalServings && (
            <> (originally {recipe.originalServings})</>
          )}
        </Typography>
      </Box>

      <IconButton size="small" onClick={handleMenuOpen}>
        <MoreIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleAdjust}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Adjust servings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRemove} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Remove</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
