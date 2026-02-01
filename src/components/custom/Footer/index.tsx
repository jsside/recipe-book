import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  Stack,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Instagram, Twitter, YouTube } from "@mui/icons-material";
import { SITE_NAME } from "@/app/constants";

export function Footer() {
  const footerLinks = {
    Recipes: [
      { label: "All recipes", href: "/recipes" },
      { label: "Breakfast", href: "/recipes?category=Make-ahead breakfasts" },
      { label: "Lunch", href: "/recipes?category=Easy lunches" },
      { label: "Dinner", href: "/recipes?category=Dinner" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        mt: "auto",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and social */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight={500} sx={{ mb: 2 }}>
              {SITE_NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Share and discover your friends' favorite recipes.
            </Typography>
          </Grid>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={title}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ mb: 2, color: "text.primary" }}
              >
                {title}
              </Typography>
              <Stack spacing={1}>
                {links.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    to={link.href}
                    sx={{
                      color: "text.secondary",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
