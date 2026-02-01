import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  People as PeopleIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const mealPlans = [
  {
    id: "1",
    title: "Budget-Friendly Week",
    description: "Delicious meals that won't break the bank",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
    meals: 7,
    prepTime: "2 hours",
    servings: 4,
  },
  {
    id: "2",
    title: "High Protein Week",
    description: "Fuel your fitness goals with protein-packed meals",
    image:
      "https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&q=80",
    meals: 7,
    prepTime: "3 hours",
    servings: 2,
  },
  {
    id: "3",
    title: "Vegetarian Delights",
    description: "A week of delicious meat-free meals",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    meals: 7,
    prepTime: "2.5 hours",
    servings: 4,
  },
  {
    id: "4",
    title: "Quick & Easy",
    description: "For busy weeknights when time is short",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    meals: 5,
    prepTime: "1 hour",
    servings: 2,
  },
];

export default function MealPlans() {
  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, maxWidth: 600 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 1 }}
          >
            Meal Plans & Batch Cooking
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "1.1rem" }}>
            Take the stress out of meal planning with our curated weekly plans.
            Each plan includes a shopping list and batch cooking instructions.
          </Typography>
        </Box>

        {/* CTA Banner */}
        <Card
          sx={{
            mb: 6,
            p: { xs: 4, md: 6 },
            bgcolor: "primary.main",
            borderRadius: 4,
          }}
        >
          <Box sx={{ maxWidth: 500 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Create Your Own Meal Plan
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Drag and drop recipes to build your perfect week. Our smart system
              will generate a combined shopping list automatically.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<ArrowIcon />}
            >
              Start Planning
            </Button>
          </Box>
        </Card>

        {/* Meal Plans Grid */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Pre-made Meal Plans
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {mealPlans.map((plan) => (
            <Grid size={{ xs: 12, md: 6 }} key={plan.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                  "&:hover .plan-image": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box sx={{ overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    image={plan.image}
                    alt={plan.title}
                    className="plan-image"
                    sx={{
                      aspectRatio: "16/9",
                      objectFit: "cover",
                      transition: "transform 0.5s",
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {plan.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {plan.description}
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <CalendarIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {plan.meals} meals
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <ClockIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {plan.prepTime}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PeopleIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {plan.servings} servings
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Batch Cooking Tips */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Batch Cooking Tips
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              title: "Prep Once, Eat All Week",
              description:
                "Learn how to prep ingredients in bulk to save time during the week.",
            },
            {
              title: "Smart Storage",
              description:
                "Tips for storing prepped meals to maintain freshness and flavor.",
            },
            {
              title: "Scale Your Recipes",
              description:
                "Easily double or triple recipes with our batch cooking calculator.",
            },
          ].map((tip) => (
            <Grid size={{ xs: 12, md: 4 }} key={tip.title}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tip.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
