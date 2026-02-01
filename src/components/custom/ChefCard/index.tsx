import { Link } from "react-router-dom";
import { Box, Avatar, Typography } from "@mui/material";
import { ChefCardProps } from "./interfaces";

export default function ChefCard({ chef }: ChefCardProps) {
  return (
    <Box
      component={Link}
      to={`/chef/${encodeURIComponent(chef.name)}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <Avatar
        src={chef.avatar}
        alt={chef.name}
        sx={{
          width: 100,
          height: 100,
          mb: 1.5,
          border: "3px solid",
          borderColor: "divider",
        }}
      />
      <Typography
        variant="subtitle1"
        fontWeight={500}
        sx={{ textAlign: "center" }}
      >
        {chef.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {chef.recipeCount} {chef.recipeCount === 1 ? "recipe" : "recipes"}
      </Typography>
    </Box>
  );
}
