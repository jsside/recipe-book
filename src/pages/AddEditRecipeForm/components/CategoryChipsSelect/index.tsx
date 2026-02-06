import { Chip, Stack, Typography, Box } from "@mui/material";
import { CategoryChipsSelectProps } from "./interfaces";

export function CategoryChipsSelect({
  options,
  selected,
  onChange,
  label,
}: CategoryChipsSelectProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <Box>
      {label && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {label}
        </Typography>
      )}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            onClick={() => handleToggle(option)}
            color={selected.includes(option) ? "primary" : "default"}
            variant={selected.includes(option) ? "filled" : "outlined"}
            sx={{
              fontWeight: 500,
              textTransform: "capitalize",
              cursor: "pointer",
              "&:hover": {
                bgcolor: selected.includes(option)
                  ? "primary.dark"
                  : "action.hover",
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
