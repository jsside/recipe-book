import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: '6rem', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Oops! Page not found
        </Typography>
        <Button component={Link} to="/" variant="contained" color="secondary">
          Return to Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;
