import { Box, Container, Typography, Grid, Link as MuiLink, Stack, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, YouTube, Facebook } from '@mui/icons-material';

export function Footer() {
  const footerLinks = {
    Recipes: [
      { label: 'All Recipes', href: '/recipes' },
      { label: 'Dinner', href: '/recipes?category=Dinner' },
      { label: 'Breakfast', href: '/recipes?category=Make-ahead breakfasts' },
      { label: 'Lunch', href: '/recipes?category=Easy lunches' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'secondary.main',
        color: 'secondary.contrastText',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and social */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h4"
              fontFamily='"Fraunces", serif'
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              mob
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
              Cooking made simple. Discover delicious recipes and cook with confidence.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: 'inherit' }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'inherit' }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'inherit' }}>
                <YouTube />
              </IconButton>
              <IconButton sx={{ color: 'inherit' }}>
                <Facebook />
              </IconButton>
            </Stack>
          </Grid>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={title}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                {title}
              </Typography>
              <Stack spacing={1}>
                {links.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    to={link.href}
                    sx={{
                      color: 'inherit',
                      opacity: 0.8,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': { opacity: 1 },
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
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} MOB Kitchen. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
