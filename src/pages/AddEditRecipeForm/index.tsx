import { useState } from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { Formik, Form, FormikProps } from "formik";
import {
  Chip,
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";

import { ArrowBack as BackIcon, FlareOutlined } from "@mui/icons-material";

import { useAddRecipe } from "@/hooks/useAddRecipe";
import { useUpdateRecipe } from "@/hooks/useUpdateRecipe";
import { invalidateGetRecipe, useGetRecipe } from "@/hooks/useGetRecipe";
import { useNotification } from "@/context/NotificationContext/utils";
import { useAuth } from "@/context/AuthContext/utils";
import RenderComponent from "@/components/helpers/renderComponent";

import { AddEditRecipeFormFields } from "./interfaces";
import { recipeFormSchema } from "./validation";
import {
  getFormInitialValues,
  transformFormToRecipe,
  validateFormData,
} from "./utils";

import { processImages } from "./utils/uploadHelpers";

import { BasicInfoSection } from "./components/BasicInfoSection";
import { CategoriesSection } from "./components/CategoriesSection";
import { IngredientsSection } from "./components/IngredientsSection";
import { InstructionsSection } from "./components/InstructionsSection";
import { ReferencesSection } from "./components/ReferencesSection";
import { AdditionalInfoSection } from "./components/AdditionalInfoSection";
import { NutritionSection } from "./components/NutritionSection";
import { CancelConfirmDialog } from "./components/CancelConfirmDialog";
import { useFormHotkeys } from "./hooks/useFormHotkeys";

function RecipeFormContent({
  formik,
  onCancel,
  onSubmit,
}: {
  formik: FormikProps<AddEditRecipeFormFields>;
  onCancel: () => void;
  onSubmit: (() => Promise<void>) & (() => Promise<AddEditRecipeFormFields>);
}) {
  useFormHotkeys(formik, onSubmit);

  return (
    <>
      <Stack spacing={4}>
        <BasicInfoSection />
        <CategoriesSection />
        <IngredientsSection />
        <InstructionsSection />
        <ReferencesSection />
        <AdditionalInfoSection />
        <NutritionSection />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          onClick={onCancel}
          sx={{ py: 1.5, flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          disabled={formik.isSubmitting}
          sx={{ py: 1.5, flex: 2 }}
        >
          {formik.isSubmitting ? "Saving..." : "Save Recipe"}
        </Button>
      </Stack>
    </>
  );
}

export default function AddEditRecipeForm() {
  const { id } = useParams<{ id?: string }>();
  const recipeId = id ? parseInt(id, 10) : 0;
  const isEditMode = Boolean(id);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { user } = useAuth();

  const { showNotification } = useNotification();
  const addRecipe = useAddRecipe();
  const updateRecipe = useUpdateRecipe();
  const navigate = useNavigate();

  const { data: existingRecipe, isLoading: isLoadingRecipe } =
    useGetRecipe(recipeId);

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
  const canEdit =
    !isEditMode ||
    (existingRecipe && user && existingRecipe.chef?.name === user.name);
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

  const handleSubmit = async (
    values: AddEditRecipeFormFields,
    {
      setSubmitting,
      setStatus,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setStatus: (status: string | null) => void;
    },
  ) => {
    const validationError = validateFormData(values);
    if (validationError) {
      setStatus(validationError);
      setSubmitting(false);
      return;
    }

    try {
      // Upload any local images to Cloudinary on save
      const uploadedImages = await processImages(values.images);
      const valuesWithUploadedImages = {
        ...values,
        images: uploadedImages.length > 0 ? uploadedImages : [""],
      };

      const recipeData = transformFormToRecipe(valuesWithUploadedImages, {
        name: user.name,
        avatar: user.avatar,
        chefId: user.chefId,
      });

      if (isEditMode && recipeId) {
        await updateRecipe({ id: recipeId, updates: recipeData });
        showNotification("Recipe updated successfully!", "success");
        setTimeout(() => navigate(`/recipe/${recipeId}`), 1000);
      } else {
        await addRecipe(recipeData);
        showNotification("Recipe created successfully!", "success");
        setTimeout(() => navigate("/recipes"), 1000);
      }
    } catch (err) {
      const errorMsg = `Failed to ${isEditMode ? "update" : "create"} recipe`;
      setStatus(errorMsg);
      showNotification(errorMsg, "error");
    }
    setSubmitting(false);
    // invalidate getRecipe to refetch query
    invalidateGetRecipe(recipeId);
  };

  const formInitialValues = getFormInitialValues(existingRecipe);

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    navigate(-1);
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "background.default" }}>
      <Container maxWidth="md">
        <Button
          startIcon={<BackIcon />}
          onClick={handleCancelClick}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Back
        </Button>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Typography variant="h4">
            {isEditMode ? "Edit recipe" : "Add new recipe"}
          </Typography>

          <div>
            <TipsTooltip />
          </div>
        </Stack>

        <Formik
          initialValues={formInitialValues}
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

              <RecipeFormContent
                formik={formik}
                onCancel={handleCancelClick}
                onSubmit={formik.submitForm}
              />

              <CancelConfirmDialog
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                onConfirm={handleCancelConfirm}
              />
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
}

const TipsTooltip = () => {
  const HotKeysMenu = (
    <List dense sx={{ width: "150px" }}>
      <ListItem
        secondaryAction={
          <Chip
            label={<Typography variant="caption">{"⌘+Z"}</Typography>}
            color="info"
            size="small"
          />
        }
      >
        <ListItemText
          primary={<Typography variant="caption">Undo</Typography>}
        />
      </ListItem>
      <ListItem
        secondaryAction={
          <Chip
            label={<Typography variant="caption">{"⌘+Enter"}</Typography>}
            color="info"
            size="small"
          />
        }
      >
        <ListItemText
          primary={<Typography variant="caption">Save</Typography>}
        />
      </ListItem>
    </List>
  );

  return (
    <Tooltip title={HotKeysMenu}>
      <FlareOutlined />
    </Tooltip>
  );
};
