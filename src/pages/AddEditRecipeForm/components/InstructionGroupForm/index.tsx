import {
  Box,
  TextField,
  IconButton,
  Stack,
  Typography,
  Button,
  Paper,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  DragHandle as DragIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import {
  InstructionGroupFormProps,
  InstructionGroupFormItem,
  InstructionFormStep,
} from "./interfaces";

const createEmptyStep = (): InstructionFormStep => ({
  text: "",
  timer: undefined,
});

const createEmptyGroup = (): InstructionGroupFormItem => ({
  heading: "",
  steps: [createEmptyStep()],
});

export function InstructionGroupForm({
  groups,
  onChange,
}: InstructionGroupFormProps) {
  const addGroup = () => {
    onChange([...groups, createEmptyGroup()]);
  };

  const removeGroup = (groupIndex: number) => {
    if (groups.length > 1) {
      onChange(groups.filter((_, i) => i !== groupIndex));
    }
  };

  const updateGroupHeading = (groupIndex: number, heading: string) => {
    const updated = [...groups];
    updated[groupIndex] = { ...updated[groupIndex], heading };
    onChange(updated);
  };

  const addStep = (groupIndex: number) => {
    const updated = [...groups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      steps: [...updated[groupIndex].steps, createEmptyStep()],
    };
    onChange(updated);
  };

  const removeStep = (groupIndex: number, stepIndex: number) => {
    const updated = [...groups];
    if (updated[groupIndex].steps.length > 1) {
      updated[groupIndex] = {
        ...updated[groupIndex],
        steps: updated[groupIndex].steps.filter((_, i) => i !== stepIndex),
      };
      onChange(updated);
    }
  };

  const updateStep = (
    groupIndex: number,
    stepIndex: number,
    field: keyof InstructionFormStep,
    value: string | number | undefined,
  ) => {
    const updated = [...groups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      steps: updated[groupIndex].steps.map((step, i) =>
        i === stepIndex ? { ...step, [field]: value } : step,
      ),
    };
    onChange(updated);
  };

  // Get global step number
  const getGlobalStepNumber = (
    groupIndex: number,
    stepIndex: number,
  ): number => {
    let count = 0;
    for (let g = 0; g < groupIndex; g++) {
      count += groups[g].steps.length;
    }
    return count + stepIndex + 1;
  };

  return (
    <Stack spacing={3}>
      {groups.map((group, groupIndex) => (
        <Paper
          key={groupIndex}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={2}>
            {/* Group Header */}
            <Stack direction="row" spacing={2} alignItems="center">
              <DragIcon sx={{ color: "text.disabled", cursor: "grab" }} />
              <TextField
                value={group.heading}
                onChange={(e) => updateGroupHeading(groupIndex, e.target.value)}
                placeholder="Section heading (optional, e.g., 'Make the dough')"
                size="small"
                fullWidth
                variant="standard"
                InputProps={{
                  sx: { fontWeight: 600, fontSize: "1rem" },
                }}
              />
              {groups.length > 1 && (
                <IconButton
                  onClick={() => removeGroup(groupIndex)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>

            <Divider />

            {/* Steps */}
            <Stack spacing={2}>
              {group.steps.map((step, stepIndex) => (
                <Stack
                  key={stepIndex}
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
                      color: "primary.contrastText",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    {getGlobalStepNumber(groupIndex, stepIndex)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      value={step.text}
                      onChange={(e) =>
                        updateStep(
                          groupIndex,
                          stepIndex,
                          "text",
                          e.target.value,
                        )
                      }
                      placeholder={`Step ${getGlobalStepNumber(groupIndex, stepIndex)}`}
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                    />
                    <TextField
                      value={step.timer || ""}
                      onChange={(e) =>
                        updateStep(
                          groupIndex,
                          stepIndex,
                          "timer",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      placeholder="Timer"
                      size="small"
                      type="number"
                      sx={{ mt: 1, width: 140 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TimerIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">min</InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                  <IconButton
                    onClick={() => removeStep(groupIndex, stepIndex)}
                    size="small"
                    disabled={group.steps.length === 1}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Button
              startIcon={<AddIcon />}
              onClick={() => addStep(groupIndex)}
              size="small"
              sx={{ alignSelf: "flex-start", ml: 5 }}
            >
              Add Step
            </Button>
          </Stack>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addGroup}
        variant="outlined"
        sx={{ alignSelf: "flex-start" }}
      >
        Add Instruction Group
      </Button>
    </Stack>
  );
}
