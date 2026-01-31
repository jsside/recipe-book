import { Box, Typography, Button, Stack } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { HorizontalScrollProps } from "./interfaces";

export default function HorizontalScroll({
  title,
  subtitle,
  children,
  viewAllLink,
  viewAllText = "View all",
}: HorizontalScrollProps) {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 3,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mb: 0.5 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {viewAllLink && (
          <Button
            component={Link}
            to={viewAllLink}
            endIcon={<ArrowIcon />}
            sx={{
              display: { xs: "none", md: "flex" },
              color: "text.primary",
            }}
          >
            {viewAllText}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          overflowX: "auto",
          px: { xs: 2, md: 4 },
          pb: 2,
          scrollSnapType: "x mandatory",
          // Hide scrollbar
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
