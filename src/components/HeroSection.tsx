import { Box, Container, Typography, Grid, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        py: { xs: 6, md: 10 },
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 3,
              }}
            >
              Cook with confidence
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.125rem",
                color: "text.secondary",
                mb: 4,
                maxWidth: 480,
              }}
            >
              Discover thousands of delicious recipes, build your shopping list,
              and plan your meals for the week ahead.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                to="/recipes"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ px: 4 }}
              >
                Explore Recipes
              </Button>
              <Button
                component={Link}
                to="/auth"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  borderColor: "text.primary",
                  color: "text.primary",
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              {[
                "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
                "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
              ].map((src, index) => (
                <Box
                  key={index}
                  component="img"
                  src={src}
                  alt={`Food ${index + 1}`}
                  sx={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: 3,
                    transform: index % 2 === 1 ? "translateY(16px)" : "none",
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
