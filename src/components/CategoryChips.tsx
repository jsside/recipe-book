import { Box, Chip, Stack } from "@mui/material";
import { categories } from "@/data/recipes";

interface CategoryChipsProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryChips({
  selectedCategory,
  onCategoryChange,
}: CategoryChipsProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        overflowX: "auto",
        py: 2,
        px: 1,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      <Chip
        label="All"
        onClick={() => onCategoryChange(null)}
        color={selectedCategory === null ? "primary" : "default"}
        sx={{
          fontWeight: 500,
          bgcolor:
            selectedCategory === null ? "primary.main" : "background.paper",
        }}
      />
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          onClick={() => onCategoryChange(category)}
          color={selectedCategory === category ? "primary" : "default"}
          sx={{
            fontWeight: 500,
            bgcolor:
              selectedCategory === category
                ? "primary.main"
                : "background.paper",
            flexShrink: 0,
          }}
        />
      ))}
    </Stack>
  );
}
