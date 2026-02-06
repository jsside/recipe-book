import { IconButton, Typography, Stack } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { ServingsAdjusterProps } from "./interfaces";

export default function ServingsAdjuster({
  servings,
  onIncrement,
  onDecrement,
}: ServingsAdjusterProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="body2" color="text.secondary">
        Serves
      </Typography>
      <IconButton
        onClick={onDecrement}
        disabled={servings <= 1}
        size="small"
        sx={{
          border: 1,
          borderColor: "divider",
          width: 32,
          height: 32,
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography
        sx={{
          minWidth: 24,
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {servings}
      </Typography>
      <IconButton
        onClick={onIncrement}
        size="small"
        sx={{
          border: 1,
          borderColor: "divider",
          width: 32,
          height: 32,
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
