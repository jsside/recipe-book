import {
  Box,
  TextField,
  IconButton,
  Stack,
  Button,
  Paper,
  Divider,
  InputAdornment,
  Typography,
  Fade,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  DragHandle as DragIcon,
  TimerOutlined as TimerOutlinedIcon,
} from "@mui/icons-material";
import {
  InstructionGroupFormProps,
  InstructionGroupFormItem,
  InstructionFormStep,
} from "./interfaces";
import { ReactNode, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { secondsToMMSS } from "../../utils";

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
  const i18n = useI18n();

  const addGroup = () => {
    onChange([...groups, createEmptyGroup()]);
  };

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
        <InstructionGroup
          groupIndex={groupIndex}
          groups={groups}
          group={group}
          onChange={onChange}
        >
          {group.steps.map((step, stepIndex) => (
            <InstructionStep
              groups={groups}
              step={step}
              stepIndex={stepIndex}
              globalStepNumber={getGlobalStepNumber(groupIndex, stepIndex)}
              group={group}
              groupIndex={groupIndex}
              onChange={onChange}
            />
          ))}
        </InstructionGroup>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addGroup}
        variant="outlined"
        sx={{ alignSelf: "flex-start" }}
      >
        {i18n.addInstructionGroupLabel}
      </Button>
    </Stack>
  );
}

const InstructionGroup = ({
  children,
  groupIndex,
  groups,
  group,
  onChange,
}: {
  children: ReactNode;
  groupIndex: number;
  groups: InstructionGroupFormItem[];
  group: InstructionGroupFormItem;
  onChange: (groups: InstructionGroupFormItem[]) => void;
}) => {
  const i18n = useI18n();

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

  return (
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
            placeholder={i18n.groupHeadingPlaceholder}
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
        <Stack spacing={2}>{children}</Stack>

        <Button
          startIcon={<AddIcon />}
          onClick={() => addStep(groupIndex)}
          size="small"
          sx={{ alignSelf: "flex-start", ml: 5 }}
        >
          {i18n.addStepLabel}
        </Button>
      </Stack>
    </Paper>
  );
};

export const InstructionStep = ({
  groups,
  step,
  stepIndex,
  globalStepNumber,
  group,
  groupIndex,
  onChange,
}: {
  groups: InstructionGroupFormItem[];
  step: InstructionFormStep;
  stepIndex: number;
  globalStepNumber: number;
  group: InstructionGroupFormItem;
  groupIndex: number;
  onChange: (groups: InstructionGroupFormItem[]) => void;
}) => {
  const i18n = useI18n();
  const [isHovered, setIsHovered] = useState(false);
  const [timerExpanded, setTimerExpanded] = useState<boolean>(!!step.timer);

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
      steps: updated[groupIndex].steps.map((s, i) =>
        i === stepIndex ? { ...s, [field]: value } : s,
      ),
    };
    onChange(updated);
  };

  // Show controls when hovered OR timer field is expanded
  const showControls = isHovered || timerExpanded;

  return (
    <Stack
      key={stepIndex}
      direction="row"
      spacing={2}
      alignItems="flex-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Step number */}
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
        {globalStepNumber}
      </Box>

      {/* Step text */}
      <Box sx={{ flex: 1 }}>
        <TextField
          variant="standard"
          value={step.text}
          onChange={(e) =>
            updateStep(groupIndex, stepIndex, "text", e.target.value)
          }
          placeholder={i18n.stepPlaceholder({ stepNumber: globalStepNumber })}
          fullWidth
          multiline
          size="small"
        />
      </Box>

      {/* Timer & Delete */}
      <Stack direction="row" spacing={1} alignItems="end">
        {/* Timer */}
        <Box
          visibility={showControls ? "visible" : "hidden"}
          sx={{ display: "flex", alignItems: "center", width: 70 }}
        >
          {timerExpanded ? (
            <TextField
              defaultValue={secondsToMMSS(step.timer)}
              variant="standard"
              size="small"
              placeholder="00:00"
              onChange={(e) => {
                let value = e.target.value;

                // allow only digits and colon
                if (!/^[0-9:]*$/.test(value)) return;

                // auto-insert colon after MM
                if (value.length === 2 && !value.includes(":")) {
                  value += ":";
                }

                // limit to MM:SS
                if (value.length > 5) return;

                e.target.value = value;
              }}
              onBlur={(e) => {
                const value = e.target.value;

                if (!value || !value.includes(":")) {
                  updateStep(groupIndex, stepIndex, "timer", undefined);
                  setTimerExpanded(false);
                  return;
                }

                const [m, s] = value.split(":").map(Number);
                const seconds = m * 60 + Math.min(s || 0, 59);

                updateStep(groupIndex, stepIndex, "timer", seconds);
                setTimerExpanded(true);
              }}
              sx={{
                "& input": {
                  fontSize: "0.875rem",
                  letterSpacing: "0.02em",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimerOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]{2}:[0-9]{2}",
                maxLength: 5,
              }}
              autoFocus
            />
          ) : (
            <Fade in={isHovered}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                  visibility: isHovered ? "visible" : "hidden",
                }}
                onClick={() => setTimerExpanded(true)}
              >
                <TimerOutlinedIcon fontSize="small" />
                <Typography variant="body2">Timer</Typography>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Delete icon */}
        {group.steps.length > 1 && (
          <Box visibility={showControls ? "visible" : "hidden"}>
            <Fade in={showControls}>
              <IconButton
                onClick={() => removeStep(groupIndex, stepIndex)}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Fade>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};
