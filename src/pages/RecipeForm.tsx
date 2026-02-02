import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
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
  Recipe,
} from "@/data/recipes";
import { useAddRecipe } from "@/hooks/useAddRecipe";
import { useUpdateRecipe } from "@/hooks/useUpdateRecipe";
import { useGetRecipe } from "@/hooks/useGetRecipe";
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

// Form state interface for undo/redo
interface FormState {
  title: string;
  description: string;
  images: string[];
  cookTime: string;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  categories: string[];
  dietaryTags: string[];
  videoUrl: string;
  calories: number | "";
  protein: number | "";
  carbs: number | "";
  fat: number | "";
  ingredientGroups: IngredientGroupFormItem[];
  instructionGroups: InstructionGroupFormItem[];
  references: ReferenceFormItem[];
}

const getInitialState = (): FormState => ({
  title: "",
  description: "",
  images: [""],
  cookTime: "",
  servings: 4,
  difficulty: "easy",
  categories: [],
  dietaryTags: [],
  videoUrl: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  ingredientGroups: [createEmptyIngredientGroup()],
  instructionGroups: [createEmptyInstructionGroup()],
  references: [],
});

export default function RecipeForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const addRecipe = useAddRecipe();
  const updateRecipe = useUpdateRecipe();
  const navigate = useNavigate();
  
  // Fetch existing recipe for edit mode
  const { data: existingRecipe, isLoading: isLoadingRecipe } = useGetRecipe(id || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(getInitialState());
  
  // Undo/Redo history
  const historyRef = useRef<FormState[]>([getInitialState()]);
  const historyIndexRef = useRef(0);
  const isUndoRedoRef = useRef(false);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && existingRecipe) {
      const populatedState: FormState = {
        title: existingRecipe.title || "",
        description: existingRecipe.description || "",
        images: existingRecipe.images?.length ? existingRecipe.images : [""],
        cookTime: existingRecipe.cookTime || "",
        servings: existingRecipe.servings || 4,
        difficulty: existingRecipe.difficulty || "easy",
        categories: existingRecipe.category || [],
        dietaryTags: existingRecipe.dietaryTags || [],
        videoUrl: existingRecipe.videoUrl || "",
        calories: existingRecipe.nutrition?.calories || "",
        protein: existingRecipe.nutrition?.protein || "",
        carbs: existingRecipe.nutrition?.carbs || "",
        fat: existingRecipe.nutrition?.fat || "",
        ingredientGroups: existingRecipe.ingredientGroups?.map((g) => ({
          tempId: crypto.randomUUID(),
          heading: g.heading || "",
          items: g.items.map((item) => ({
            tempId: crypto.randomUUID(),
            name: item.name,
            amount: item.amount,
            unit: item.unit,
            preparation: item.preparation || "",
            note: item.note || "",
          })),
        })) || [createEmptyIngredientGroup()],
        instructionGroups: existingRecipe.instructionGroups?.map((g) => ({
          tempId: crypto.randomUUID(),
          heading: g.heading || "",
          steps: g.steps.map((step) => ({
            tempId: crypto.randomUUID(),
            text: step.text,
            timer: step.timer,
          })),
        })) || [createEmptyInstructionGroup()],
        references: existingRecipe.references?.map((ref) => ({
          tempId: crypto.randomUUID(),
          type: ref.type,
          url: ref.url,
          title: ref.title || "",
        })) || [],
      };
      setFormState(populatedState);
      historyRef.current = [populatedState];
      historyIndexRef.current = 0;
    }
  }, [isEditMode, existingRecipe]);

  // Update form state with history tracking
  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState((prev) => {
      const newState = { ...prev, ...updates };
      
      // Don't track undo/redo operations
      if (!isUndoRedoRef.current) {
        // Remove any redo history
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        historyRef.current.push(newState);
        historyIndexRef.current = historyRef.current.length - 1;
        
        // Limit history size
        if (historyRef.current.length > 50) {
          historyRef.current.shift();
          historyIndexRef.current--;
        }
      }
      
      return newState;
    });
  }, []);

  // Undo handler
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      isUndoRedoRef.current = true;
      historyIndexRef.current--;
      setFormState(historyRef.current[historyIndexRef.current]);
      setTimeout(() => { isUndoRedoRef.current = false; }, 0);
    }
  }, []);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoRef.current = true;
      historyIndexRef.current++;
      setFormState(historyRef.current[historyIndexRef.current]);
      setTimeout(() => { isUndoRedoRef.current = false; }, 0);
    }
  }, []);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Check authorization for edit mode
  const canEdit = !isEditMode || (existingRecipe && user && existingRecipe.chef?.name === user.name);

  // Only chefs can create/edit recipes
  if (!user || user.role !== "chef") {
    return <Navigate to="/" replace />;
  }

  // Show loading for edit mode
  if (isEditMode && isLoadingRecipe) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography>Loading recipe...</Typography>
      </Container>
    );
  }

  // Check if user can edit this recipe
  if (isEditMode && existingRecipe && !canEdit) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You can only edit your own recipes
        </Typography>
        <Button onClick={() => navigate(-1)} variant="contained">
          Go Back
        </Button>
      </Container>
    );
  }

  // Image handlers
  const handleAddImage = () => {
    updateFormState({ images: [...formState.images, ""] });
  };

  const handleRemoveImage = (index: number) => {
    updateFormState({ images: formState.images.filter((_, i) => i !== index) });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formState.images];
    newImages[index] = value;
    updateFormState({ images: newImages });
  };

  // Reference handlers
  const handleAddReference = (type: "link" | "image") => {
    updateFormState({ references: [...formState.references, createEmptyReference(type)] });
  };

  const handleRemoveReference = (tempId: string) => {
    updateFormState({ references: formState.references.filter((ref) => ref.tempId !== tempId) });
  };

  const handleReferenceChange = (
    tempId: string,
    field: "url" | "title",
    value: string,
  ) => {
    updateFormState({
      references: formState.references.map((ref) =>
        ref.tempId === tempId ? { ...ref, [field]: value } : ref,
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formState.title.trim() || !formState.description.trim() || !formState.cookTime.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate ingredients
    const hasValidIngredient = formState.ingredientGroups.some((group) =>
      group.items.some((item) => item.name.trim() && item.amount.trim()),
    );
    if (!hasValidIngredient) {
      setError("Please add at least one ingredient");
      setLoading(false);
      return;
    }

    // Validate instructions
    const hasValidInstruction = formState.instructionGroups.some((group) =>
      group.steps.some((step) => step.text.trim()),
    );
    if (!hasValidInstruction) {
      setError("Please add at least one instruction");
      setLoading(false);
      return;
    }

    try {
      // Transform form data to recipe format
      const formattedIngredientGroups = formState.ingredientGroups
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

      const formattedInstructionGroups = formState.instructionGroups
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
      const validImages = formState.images.filter((img) => img.trim());

      // Format references
      const formattedReferences: RecipeReference[] = formState.references
        .filter((ref) => ref.url.trim())
        .map((ref) => ({
          type: ref.type,
          url: ref.url,
          title: ref.title || undefined,
        }));

      const recipeData: Omit<Recipe, "id"> = {
        title: formState.title,
        description: formState.description,
        images: validImages.length > 0 ? validImages : undefined,
        cookTime: formState.cookTime,
        servings: formState.servings,
        difficulty: formState.difficulty,
        category: formState.categories.length > 0 ? formState.categories : ["Dinner"],
        dietaryTags: formState.dietaryTags,
        videoUrl: formState.videoUrl || undefined,
        chef: {
          name: user.name,
          avatar:
            user.avatar ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        },
        ingredientGroups: formattedIngredientGroups,
        instructionGroups: formattedInstructionGroups,
        nutrition:
          formState.calories || formState.protein || formState.carbs || formState.fat
            ? {
                calories: formState.calories || undefined,
                protein: formState.protein || undefined,
                carbs: formState.carbs || undefined,
                fat: formState.fat || undefined,
              }
            : undefined,
        references: formattedReferences.length > 0 ? formattedReferences : undefined,
      };

      if (isEditMode && id) {
        await updateRecipe({ id, updates: recipeData });
        showNotification("Recipe updated successfully!", "success");
        setTimeout(() => navigate(`/recipe/${id}`), 1000);
      } else {
        await addRecipe(recipeData);
        showNotification("Recipe created successfully!", "success");
        setTimeout(() => navigate("/recipes"), 1000);
      }
    } catch (err) {
      setError(isEditMode ? "Failed to update recipe" : "Failed to create recipe");
      showNotification(isEditMode ? "Failed to update recipe" : "Failed to create recipe", "error");
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

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h4">
            {isEditMode ? "Edit Recipe" : "Add New Recipe"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tip: Use Ctrl+Z / Cmd+Z to undo
          </Typography>
        </Stack>

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
                    value={formState.title}
                    onChange={(e) => updateFormState({ title: e.target.value })}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Description"
                    value={formState.description}
                    onChange={(e) => updateFormState({ description: e.target.value })}
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
                    {formState.images.map((image, index) => (
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
                          if={formState.images.length > 1}
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
                    value={formState.cookTime}
                    onChange={(e) => updateFormState({ cookTime: e.target.value })}
                    required
                    fullWidth
                    placeholder="e.g., 30 mins"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Servings"
                    type="number"
                    value={formState.servings}
                    onChange={(e) => updateFormState({ servings: Number(e.target.value) })}
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={formState.difficulty}
                      label="Difficulty"
                      onChange={(e) =>
                        updateFormState({ difficulty: e.target.value as typeof formState.difficulty })
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
                  selected={formState.categories}
                  onChange={(categories) => updateFormState({ categories })}
                  label="Categories"
                />
                <CategoryChipsSelect
                  options={dietaryOptions}
                  selected={formState.dietaryTags}
                  onChange={(dietaryTags) => updateFormState({ dietaryTags })}
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
                groups={formState.ingredientGroups}
                onChange={(ingredientGroups) => updateFormState({ ingredientGroups })}
              />
            </Paper>

            {/* Instructions */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Instructions
              </Typography>
              <InstructionGroupForm
                groups={formState.instructionGroups}
                onChange={(instructionGroups) => updateFormState({ instructionGroups })}
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
                {formState.references.map((ref) => (
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
                    value={formState.videoUrl}
                    onChange={(e) => updateFormState({ videoUrl: e.target.value })}
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
                    value={formState.calories}
                    onChange={(e) =>
                      updateFormState({ calories: e.target.value ? Number(e.target.value) : "" })
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    label="Protein (g)"
                    type="number"
                    value={formState.protein}
                    onChange={(e) =>
                      updateFormState({ protein: e.target.value ? Number(e.target.value) : "" })
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    label="Carbs (g)"
                    type="number"
                    value={formState.carbs}
                    onChange={(e) =>
                      updateFormState({ carbs: e.target.value ? Number(e.target.value) : "" })
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    label="Fat (g)"
                    type="number"
                    value={formState.fat}
                    onChange={(e) =>
                      updateFormState({ fat: e.target.value ? Number(e.target.value) : "" })
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
              {loading
                ? isEditMode
                  ? "Updating Recipe..."
                  : "Creating Recipe..."
                : isEditMode
                  ? "Update Recipe"
                  : "Create Recipe"}
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}
