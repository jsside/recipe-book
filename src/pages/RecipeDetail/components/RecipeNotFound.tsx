import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const RecipeNotFound = () => {
  return (
    <Container sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Recipe not found
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back to home
      </Button>
    </Container>
  );
};
