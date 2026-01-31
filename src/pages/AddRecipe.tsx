import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { dietaryOptions, difficultyOptions } from "@/data/recipes";
import { useAddRecipe } from "@/hooks/useAddRecipe";
import { IngredientGroupForm } from "@/components/custom/IngredientGroupForm";
import { IngredientGroupFormItem } from "@/components/custom/IngredientGroupForm/interfaces";
import { InstructionGroupForm } from "@/components/custom/InstructionGroupForm";
import { InstructionGroupFormItem } from "@/components/custom/InstructionGroupForm/interfaces";
import { CategoryChipsSelect } from "@/components/custom/CategoryChipsSelect";

const categoryOptions = [
  "Dinner",
  "Breakfast",
  "Lunch",
  "Dessert",
  "Snack",
  "Packed lunches",
  "Make-ahead breakfasts",
];

const createEmptyIngredientGroup = (): IngredientGroupFormItem => ({
  tempId: crypto.randomUUID(),
  heading: "",
  items: [
    {
      tempId: crypto.randomUUID(),
      name: "",
      amount: "",
      unit: "",
      preparation: "",
      note: "",
    },
  ],
});

const createEmptyInstructionGroup = (): InstructionGroupFormItem => ({
  tempId: crypto.randomUUID(),
  heading: "",
  steps: [{ tempId: crypto.randomUUID(), text: "", timer: undefined }],
});

export default function AddRecipe() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const addRecipe = useAddRecipe();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  // Nutrition
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fat, setFat] = useState<number | "">("");

  // Grouped ingredients and instructions
  const [ingredientGroups, setIngredientGroups] = useState<
    IngredientGroupFormItem[]
  >([createEmptyIngredientGroup()]);
  const [instructionGroups, setInstructionGroups] = useState<
    InstructionGroupFormItem[]
  >([createEmptyInstructionGroup()]);

  // Only chefs can create recipes
  if (!user || user.role !== "chef") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!title.trim() || !description.trim() || !cookTime.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate ingredients
    const hasValidIngredient = ingredientGroups.some((group) =>
      group.items.some((item) => item.name.trim() && item.amount.trim())
    );
    if (!hasValidIngredient) {
      setError("Please add at least one ingredient");
      setLoading(false);
      return;
    }

    // Validate instructions
    const hasValidInstruction = instructionGroups.some((group) =>
      group.steps.some((step) => step.text.trim())
    );
    if (!hasValidInstruction) {
      setError("Please add at least one instruction");
      setLoading(false);
      return;
    }

    try {
      // Transform form data to recipe format
      const formattedIngredientGroups = ingredientGroups
        .map((group) => ({
          heading: group.heading || undefined,
          items: group.items
            .filter((item) => item.name.trim())
            .map((item, idx) => ({
              id: crypto.randomUUID(),
              name: item.name,
              amount: item.amount,
              unit: item.unit,
              preparation: item.preparation || undefined,
              note: item.note || undefined,
            })),
        }))
        .filter((group) => group.items.length > 0);

      const formattedInstructionGroups = instructionGroups
        .map((group) => ({
          heading: group.heading || undefined,
          steps: group.steps
            .filter((step) => step.text.trim())
            .map((step) => ({
              text: step.text,
              timer: step.timer || undefined,
            })),
        }))
        .filter((group) => group.steps.length > 0);

      await addRecipe({
        title,
        description,
        image:
          image ||
          "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80",
        cookTime,
        servings,
        difficulty,
        category: categories.length > 0 ? categories : ["Dinner"],
        dietaryTags,
        videoUrl: videoUrl || undefined,
        chef: {
          name: user.name,
          avatar:
            user.avatar ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        },
        ingredientGroups: formattedIngredientGroups,
        instructionGroups: formattedInstructionGroups,
        nutrition:
          calories || protein || carbs || fat
            ? {
                calories: calories || undefined,
                protein: protein || undefined,
                carbs: carbs || undefined,
                fat: fat || undefined,
              }
            : undefined,
      });

      showNotification("Recipe created successfully!", "success");
      setTimeout(() => navigate("/recipes"), 1000);
    } catch (err) {
      setError("Failed to create recipe");
      showNotification("Failed to create recipe", "error");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "background.default" }}>
      <Container maxWidth="md">
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Back
        </Button>

        <Typography variant="h4" fontFamily='"Fraunces", serif' sx={{ mb: 4 }}>
          Add New Recipe
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Basic Info */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Recipe Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    fullWidth
                    placeholder="https://example.com/image.jpg"
                    helperText="Leave empty for a default image"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Cook Time"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    required
                    fullWidth
                    placeholder="e.g., 30 mins"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={difficulty}
                      label="Difficulty"
                      onChange={(e) =>
                        setDifficulty(e.target.value as typeof difficulty)
                      }
                    >
                      {difficultyOptions.map((opt) => (
                        <MenuItem
                          key={opt}
                          value={opt}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Categories & Tags */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Categories & Tags
              </Typography>
              <Stack spacing={3}>
                <CategoryChipsSelect
                  options={categoryOptions}
                  selected={categories}
                  onChange={setCategories}
                  label="Categories"
                />
                <CategoryChipsSelect
                  options={dietaryOptions}
                  selected={dietaryTags}
                  onChange={setDietaryTags}
                  label="Dietary Tags"
                />
              </Stack>
            </Paper>

            {/* Ingredients */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Ingredients
              </Typography>
              <IngredientGroupForm
                groups={ingredientGroups}
                onChange={setIngredientGroups}
              />
            </Paper>

            {/* Instructions */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Instructions
              </Typography>
              <InstructionGroupForm
                groups={instructionGroups}
                onChange={setInstructionGroups}
              />
            </Paper>

            {/* Extra Info */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Additional Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Video URL (optional)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    fullWidth
                    placeholder="https://youtube.com/..."
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Nutrition */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Nutrition (per serving, optional)
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    label="Calories"
                    type="number"
                    value={calories}
                    onChange={(e) =>
                      setCalories(e.target.value ? Number(e.target.value) : "")
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    label="Protein (g)"
                    type="number"
                    value={protein}
                    onChange={(e) =>
                      setProtein(e.target.value ? Number(e.target.value) : "")
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    label="Carbs (g)"
                    type="number"
                    value={carbs}
                    onChange={(e) =>
                      setCarbs(e.target.value ? Number(e.target.value) : "")
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    label="Fat (g)"
                    type="number"
                    value={fat}
                    onChange={(e) =>
                      setFat(e.target.value ? Number(e.target.value) : "")
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? "Creating Recipe..." : "Create Recipe"}
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}
