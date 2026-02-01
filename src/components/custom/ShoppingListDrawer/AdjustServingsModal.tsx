import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  IconButton,
  Box,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { AdjustServingsModalProps } from "./interfaces";

export function AdjustServingsModal({
  open,
  onClose,
  recipe,
  onSave,
}: AdjustServingsModalProps) {
  const [servings, setServings] = useState(recipe.servings);

  const handleIncrement = () => setServings((prev) => prev + 1);
  const handleDecrement = () => setServings((prev) => Math.max(1, prev - 1));

  const handleSave = () => {
    onSave(recipe.recipeId, servings);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Adjust servings</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {recipe.recipeTitle}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <IconButton
            onClick={handleDecrement}
            disabled={servings <= 1}
            sx={{
              border: 1,
              borderColor: "divider",
              width: 48,
              height: 48,
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Box sx={{ textAlign: "center", minWidth: 80 }}>
            <Typography variant="h4" fontWeight={600}>
              {servings}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              servings
            </Typography>
          </Box>

          <IconButton
            onClick={handleIncrement}
            sx={{
              border: 1,
              borderColor: "divider",
              width: 48,
              height: 48,
            }}
          >
            <AddIcon />
          </IconButton>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          Original recipe: {recipe.originalServings} servings
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="secondary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
