import { FormikProps } from "formik";
import { AddEditRecipeFormFields } from "../../interfaces";

export interface CancelConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formik: FormikProps<AddEditRecipeFormFields>;
}
