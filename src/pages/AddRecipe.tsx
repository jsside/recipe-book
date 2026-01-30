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
  Chip,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Create as CreateIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { dietaryOptions, difficultyOptions, Ingredient } from "@/data/recipes";
import { useAddRecipe } from "@/hooks/useAddRecipe";

export default function AddRecipe() {
  const { user } = useAuth();
  
  const addRecipe = useAddRecipe();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy",
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  // Nutrition
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fat, setFat] = useState<number | "">("");

  // Ingredients
  const [ingredients, setIngredients] = useState<Omit<Ingredient, "id">[]>([
    { name: "", amount: "", unit: "", category: "" },
  ]);

  // Instructions
  const [instructions, setInstructions] = useState<string[]>([""]);

  // Only chefs can create recipes
  if (!user || user.role !== "chef") {
    return <Navigate to="/" replace />;
  }

  const createIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", amount: "", unit: "", category: "" },
    ]);
  };

  const updateIngredient = (
    index: number,
    field: keyof Omit<Ingredient, "id">,
    value: string,
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const createInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

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

    const validIngredients = ingredients.filter(
      (i) => i.name.trim() && i.amount.trim(),
    );
    if (validIngredients.length === 0) {
      setError("Please create at least one ingredient");
      setLoading(false);
      return;
    }

    const validInstructions = instructions.filter((i) => i.trim());
    if (validInstructions.length === 0) {
      setError("Please create at least one instruction");
      setLoading(false);
      return;
    }

    try {
      addRecipe({
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
        ingredients: validIngredients.map((ing, idx) => ({
          ...ing,
          id: String(idx + 1),
        })),
        instructions: validInstructions,
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

      setSuccess(true);
      setTimeout(() => navigate("/recipes"), 1500);
    } catch (err) {
      setError("Failed to create recipe");
    }

    setLoading(false);
  };

  const categoryOptions = [
    "Dinner",
    "Breakfast",
    "Lunch",
    "Dessert",
    "Snack",
    "Packed lunches",
    "Make-ahead breakfasts",
    "New recipes",
  ];

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

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Recipe created successfully! Redirecting...
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
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Categories</InputLabel>
                    <Select
                      multiple
                      value={categories}
                      label="Categories"
                      onChange={(e) =>
                        setCategories(e.target.value as string[])
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {categoryOptions.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Dietary Tags</InputLabel>
                    <Select
                      multiple
                      value={dietaryTags}
                      label="Dietary Tags"
                      onChange={(e) =>
                        setDietaryTags(e.target.value as string[])
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {dietaryOptions.map((tag) => (
                        <MenuItem
                          key={tag}
                          value={tag}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {tag}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Ingredients */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Ingredients
              </Typography>
              <Stack spacing={2}>
                {ingredients.map((ing, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    <Grid size={{ xs: 2 }}>
                      <TextField
                        label="Amount"
                        value={ing.amount}
                        onChange={(e) =>
                          updateIngredient(index, "amount", e.target.value)
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 2 }}>
                      <TextField
                        label="Unit"
                        value={ing.unit}
                        onChange={(e) =>
                          updateIngredient(index, "unit", e.target.value)
                        }
                        fullWidth
                        size="small"
                        placeholder="g, ml, tbsp"
                      />
                    </Grid>
                    <Grid size={{ xs: 5 }}>
                      <TextField
                        label="Ingredient"
                        value={ing.name}
                        onChange={(e) =>
                          updateIngredient(index, "name", e.target.value)
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 2 }}>
                      <TextField
                        label="Category"
                        value={ing.category}
                        onChange={(e) =>
                          updateIngredient(index, "category", e.target.value)
                        }
                        fullWidth
                        size="small"
                        placeholder="Pantry, Dairy"
                      />
                    </Grid>
                    <Grid size={{ xs: 1 }}>
                      <IconButton
                        onClick={() => removeIngredient(index)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  startIcon={<CreateIcon />}
                  onClick={createIngredient}
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                >
                  Create Ingredient
                </Button>
              </Stack>
            </Paper>

            {/* Instructions */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Instructions
              </Typography>
              <Stack spacing={2}>
                {instructions.map((inst, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        flexShrink: 0,
                        mt: 1,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <TextField
                      value={inst}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      placeholder={`Step ${index + 1}`}
                    />
                    <IconButton
                      onClick={() => removeInstruction(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  startIcon={<CreateIcon />}
                  onClick={createInstruction}
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                >
                  Create Step
                </Button>
              </Stack>
            </Paper>

            {/* Extra Info */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Createitional Information
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
