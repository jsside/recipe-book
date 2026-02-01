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
  IconButton,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import {
  dietaryOptions,
  difficultyOptions,
  RecipeReference,
} from "@/data/recipes";
import { useAddRecipe } from "@/hooks/useAddRecipe";
import { IngredientGroupForm } from "@/components/custom/IngredientGroupForm";
import { IngredientGroupFormItem } from "@/components/custom/IngredientGroupForm/interfaces";
import { InstructionGroupForm } from "@/components/custom/InstructionGroupForm";
import { InstructionGroupFormItem } from "@/components/custom/InstructionGroupForm/interfaces";
import { CategoryChipsSelect } from "@/components/custom/CategoryChipsSelect";
import { useNotification } from "@/context/NotificationContext/utils";
import { useAuth } from "@/context/AuthContext/utils";
import RenderComponent from "@/components/helpers/renderComponent";

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

interface ReferenceFormItem {
  tempId: string;
  type: "link" | "image";
  url: string;
  title: string;
}

const createEmptyReference = (type: "link" | "image"): ReferenceFormItem => ({
  tempId: crypto.randomUUID(),
  type,
  url: "",
  title: "",
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
  const [images, setImages] = useState<string[]>([""]);
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

  // Grouped ingredients and instructions
  const [ingredientGroups, setIngredientGroups] = useState<
    IngredientGroupFormItem[]
  >([createEmptyIngredientGroup()]);
  const [instructionGroups, setInstructionGroups] = useState<
    InstructionGroupFormItem[]
  >([createEmptyInstructionGroup()]);

  // References
  const [references, setReferences] = useState<ReferenceFormItem[]>([]);

  // Only chefs can create recipes
  if (!user || user.role !== "chef") {
    return <Navigate to="/" replace />;
  }

  // Image handlers
  const handleAddImage = () => {
    setImages([...images, ""]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  // Reference handlers
  const handleAddReference = (type: "link" | "image") => {
    setReferences([...references, createEmptyReference(type)]);
  };

  const handleRemoveReference = (tempId: string) => {
    setReferences(references.filter((ref) => ref.tempId !== tempId));
  };

  const handleReferenceChange = (
    tempId: string,
    field: "url" | "title",
    value: string,
  ) => {
    setReferences(
      references.map((ref) =>
        ref.tempId === tempId ? { ...ref, [field]: value } : ref,
      ),
    );
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

    // Validate ingredients
    const hasValidIngredient = ingredientGroups.some((group) =>
      group.items.some((item) => item.name.trim() && item.amount.trim()),
    );
    if (!hasValidIngredient) {
      setError("Please add at least one ingredient");
      setLoading(false);
      return;
    }

    // Validate instructions
    const hasValidInstruction = instructionGroups.some((group) =>
      group.steps.some((step) => step.text.trim()),
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
            .map((item) => ({
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

      // Filter valid images
      const validImages = images.filter((img) => img.trim());

      // Format references
      const formattedReferences: RecipeReference[] = references
        .filter((ref) => ref.url.trim())
        .map((ref) => ({
          type: ref.type,
          url: ref.url,
          title: ref.title || undefined,
        }));

      await addRecipe({
        title,
        description,
        images: validImages.length > 1 ? validImages : undefined,
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
        references:
          formattedReferences.length > 0 ? formattedReferences : undefined,
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

        <Typography variant="h4" sx={{ mb: 4 }}>
          Add New Recipe
        </Typography>

        <RenderComponent
          if={!!error}
          then={
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          }
        />

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

                {/* Multiple Images */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Images
                  </Typography>
                  <Stack spacing={2}>
                    {images.map((image, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <TextField
                          label={
                            index === 0
                              ? "Primary Image URL"
                              : `Image ${index + 1} URL`
                          }
                          value={image}
                          onChange={(e) =>
                            handleImageChange(index, e.target.value)
                          }
                          fullWidth
                          placeholder="https://example.com/image.jpg"
                          size="small"
                        />
                        <RenderComponent
                          if={images.length > 1}
                          then={
                            <IconButton
                              onClick={() => handleRemoveImage(index)}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          }
                        />
                      </Stack>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddImage}
                      size="small"
                      sx={{ alignSelf: "flex-start" }}
                    >
                      Add another image
                    </Button>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Add multiple images for a gallery view. First image is the
                    primary.
                  </Typography>
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

            {/* References */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                References
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add links or images as references for this recipe.
              </Typography>

              <Stack spacing={2}>
                {references.map((ref) => (
                  <Stack
                    key={ref.tempId}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <TextField
                      label={ref.type === "link" ? "Link URL" : "Image URL"}
                      value={ref.url}
                      onChange={(e) =>
                        handleReferenceChange(ref.tempId, "url", e.target.value)
                      }
                      fullWidth
                      size="small"
                      placeholder={
                        ref.type === "link"
                          ? "https://example.com"
                          : "https://example.com/image.jpg"
                      }
                    />
                    <TextField
                      label="Title (optional)"
                      value={ref.title}
                      onChange={(e) =>
                        handleReferenceChange(
                          ref.tempId,
                          "title",
                          e.target.value,
                        )
                      }
                      size="small"
                      sx={{ minWidth: 150 }}
                    />
                    <IconButton
                      onClick={() => handleRemoveReference(ref.tempId)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}

                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddReference("link")}
                    size="small"
                    variant="outlined"
                  >
                    Add link reference
                  </Button>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddReference("image")}
                    size="small"
                    variant="outlined"
                  >
                    Add image reference
                  </Button>
                </Stack>
              </Stack>
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
