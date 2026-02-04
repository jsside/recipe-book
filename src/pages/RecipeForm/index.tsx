import { useEffect } from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { Formik, Form, FormikProps } from "formik";
import { Container, Box, Typography, Button, Stack, Alert } from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";

import { useAddRecipe } from "@/hooks/useAddRecipe";
import { useUpdateRecipe } from "@/hooks/useUpdateRecipe";
import { useGetRecipe } from "@/hooks/useGetRecipe";
import { useNotification } from "@/context/NotificationContext/utils";
import { useAuth } from "@/context/AuthContext/utils";
import RenderComponent from "@/components/helpers/renderComponent";

import { RecipeFormValues } from "./interfaces";
import { getInitialValues, createEmptyIngredientGroup, createEmptyInstructionGroup } from "./constants";
import { recipeFormSchema } from "./validation";
import { transformFormToRecipe, validateFormData } from "./utils";
import { useFormHistory } from "./hooks/useFormHistory";

import { BasicInfoSection } from "./components/BasicInfoSection";
import { CategoriesSection } from "./components/CategoriesSection";
import { IngredientsSection } from "./components/IngredientsSection";
import { InstructionsSection } from "./components/InstructionsSection";
import { ReferencesSection } from "./components/ReferencesSection";
import { AdditionalInfoSection } from "./components/AdditionalInfoSection";
import { NutritionSection } from "./components/NutritionSection";

function RecipeFormContent({ formik }: { formik: FormikProps<RecipeFormValues> }) {
  useFormHistory(formik);

  return (
    <Stack spacing={4}>
      <BasicInfoSection formik={formik} />
      <CategoriesSection formik={formik} />
      <IngredientsSection formik={formik} />
      <InstructionsSection formik={formik} />
      <ReferencesSection formik={formik} />
      <AdditionalInfoSection formik={formik} />
      <NutritionSection formik={formik} />
    </Stack>
  );
}

export default function RecipeForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const { user } = useAuth();
  const { showNotification } = useNotification();
  const addRecipe = useAddRecipe();
  const updateRecipe = useUpdateRecipe();
  const navigate = useNavigate();

  const { data: existingRecipe, isLoading: isLoadingRecipe } = useGetRecipe(id || "");

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
  const canEdit = !isEditMode || (existingRecipe && user && existingRecipe.chef?.name === user.name);
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

  const getEditModeValues = (): RecipeFormValues => {
    if (!existingRecipe) return getInitialValues();
    
    return {
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
  };

  const handleSubmit = async (
    values: RecipeFormValues,
    { setSubmitting, setStatus }: { setSubmitting: (isSubmitting: boolean) => void; setStatus: (status: string | null) => void }
  ) => {
    const validationError = validateFormData(values);
    if (validationError) {
      setStatus(validationError);
      setSubmitting(false);
      return;
    }

    try {
      const recipeData = transformFormToRecipe(values, user);

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
      const errorMsg = isEditMode ? "Failed to update recipe" : "Failed to create recipe";
      setStatus(errorMsg);
      showNotification(errorMsg, "error");
    }
    setSubmitting(false);
  };

  const initialValues = isEditMode ? getEditModeValues() : getInitialValues();

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

        <Formik
          initialValues={initialValues}
          validationSchema={recipeFormSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form>
              <RenderComponent
                if={!!formik.status}
                then={
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {formik.status}
                  </Alert>
                }
              />

              <RecipeFormContent formik={formik} />

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                disabled={formik.isSubmitting}
                sx={{ py: 1.5, mt: 4 }}
                fullWidth
              >
                {formik.isSubmitting
                  ? isEditMode
                    ? "Updating Recipe..."
                    : "Creating Recipe..."
                  : isEditMode
                    ? "Update Recipe"
                    : "Create Recipe"}
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
}
