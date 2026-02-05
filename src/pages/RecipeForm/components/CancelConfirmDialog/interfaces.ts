 import { FormikProps } from "formik";
 import { RecipeFormValues } from "../../interfaces";
 
 export interface CancelConfirmDialogProps {
   open: boolean;
   onClose: () => void;
   onConfirm: () => void;
   formik: FormikProps<RecipeFormValues>;
 }