import InstructionStep from "./InstructionStep";
import RenderComponent from "@/components/helpers/renderComponent";
import { Recipe } from "@/data/recipes";
import { useServingsAdjuster } from "@/hooks/useServingsAdjuster";
import { useUnitConversion } from "@/hooks/useUnitConversion";
import {
  getAllIngredients,
  parseInstructionWithIngredients,
} from "@/utils/ingredientParser";
import { Grid, Box, Paper, Typography, Stack, Chip } from "@mui/material";
import { TimerIcon } from "lucide-react";
import { useMemo, useState } from "react";

export const MethodPanel = ({ recipe }: { recipe: Recipe }) => {
  // Calculate global step number
  let globalStepIndex = 0;

  // Get all ingredients
  const allIngredients = useMemo(() => {
    if (!recipe) return [];
    return getAllIngredients(recipe.ingredientGroups);
  }, [recipe]);

  // Get all instructions
  const allInstructions = useMemo(() => {
    if (!recipe) return [];
    if (recipe.instructionGroups && recipe.instructionGroups.length > 0) {
      return recipe.instructionGroups;
    }
    return [];
  }, [recipe]);

  const { convertAmount } = useUnitConversion();
  const { scaleIngredient } = useServingsAdjuster(recipe?.servings || 4);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <Grid size={{ xs: 12, lg: 7 }}>
      <Paper elevation={0} sx={{ p: 3, bgcolor: "transparent" }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Method
        </Typography>
        <Stack spacing={3}>
          {allInstructions.map((group, groupIndex) => (
            <Box key={groupIndex}>
              <RenderComponent
                if={!!group.heading}
                then={
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2, color: "text.primary" }}
                  >
                    {group.heading}
                  </Typography>
                }
              />
              <Stack spacing={1}>
                {group.steps.map((step, stepIndex) => {
                  const currentGlobalIndex = globalStepIndex++;
                  return (
                    <Box key={stepIndex}>
                      <InstructionStep
                        stepNumber={currentGlobalIndex + 1}
                        instruction={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                            flexWrap="wrap"
                          >
                            <Box sx={{ flex: 1 }}>
                              {parseInstructionWithIngredients(
                                step.text,
                                allIngredients,
                                convertAmount,
                                scaleIngredient,
                              )}
                            </Box>
                            <RenderComponent
                              if={!!step.timer}
                              then={
                                <Chip
                                  icon={<TimerIcon />}
                                  label={`${step.timer} min`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ flexShrink: 0 }}
                                />
                              }
                            />
                          </Stack>
                        }
                        isActive={activeStep === currentGlobalIndex}
                        onClick={() =>
                          setActiveStep(
                            activeStep === currentGlobalIndex
                              ? null
                              : currentGlobalIndex,
                          )
                        }
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Grid>
  );
};
