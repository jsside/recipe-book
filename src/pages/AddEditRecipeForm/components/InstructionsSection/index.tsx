import { Paper, Typography } from "@mui/material";
import { InstructionGroupForm } from "../InstructionGroupForm";
import { useFormikContext } from "formik";
import { AddEditRecipeFormFields } from "../../interfaces";

export function InstructionsSection() {
  const { values, setFieldValue } = useFormikContext<AddEditRecipeFormFields>();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Instructions
      </Typography>
      <InstructionGroupForm
        groups={values.instructionGroups}
        onChange={(instructionGroups) =>
          setFieldValue("instructionGroups", instructionGroups)
        }
      />
    </Paper>
  );
}
