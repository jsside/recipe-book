import { Paper, Typography } from "@mui/material";
import { InstructionGroupForm } from "@/components/custom/InstructionGroupForm";
import { InstructionsSectionProps } from "./interfaces";

export function InstructionsSection({ formik }: InstructionsSectionProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Instructions
      </Typography>
      <InstructionGroupForm
        groups={formik.values.instructionGroups}
        onChange={(instructionGroups) =>
          formik.setFieldValue("instructionGroups", instructionGroups)
        }
      />
    </Paper>
  );
}
