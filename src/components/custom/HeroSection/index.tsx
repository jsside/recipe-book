import RenderComponent from "@/components/helpers/renderComponent";
import { useAuth } from "@/context/AuthContext";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 14 },
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3rem", sm: "4rem", md: "5.5rem" },
            fontWeight: 400,
            lineHeight: 1,
            mb: 4,
            letterSpacing: "-0.02em",
          }}
        >
          Shared plates
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.125rem" },
            color: "text.secondary",
            mb: 5,
            maxWidth: 520,
            mx: "auto",
          }}
        >
          Share your favorite recipes with friends. Browse curated dishes, build
          your shopping list, and plan meals for the week ahead.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            component={Link}
            to="/recipes"
            variant="contained"
            size="large"
            endIcon={<ArrowIcon />}
            sx={{
              bgcolor: "text.primary",
              color: "background.default",
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "text.secondary",
              },
            }}
          >
            See All Recipes
          </Button>
          <RenderComponent
            if={!isAuthenticated}
            then={
              <Button
                component={Link}
                to="/auth"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: "text.primary",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "text.secondary",
                    bgcolor: "transparent",
                  },
                }}
              >
                Join the table
              </Button>
            }
          />
        </Stack>
      </Container>
    </Box>
  );
}
