import RenderComponent from "@/components/helpers/renderComponent";
import {
  Paper,
  Stack,
  Tabs,
  Tab,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  Tooltip,
  Box,
  Button,
  FormControl,
  FormControlLabel,
} from "@mui/material";

import {
  Add as AddIcon,
  Scale as ScaleIcon,
  Visibility as WakeLockIcon,
  VisibilityOff as WakeLockOffIcon,
} from "@mui/icons-material";
import { Recipe } from "@/data/recipes";
import { useMemo, useState } from "react";
import { useUnitConversion } from "@/hooks/useUnitConversion";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useServingsAdjuster } from "@/hooks/useServingsAdjuster";
import { getAllIngredients } from "@/utils/ingredientParser";
import ServingsAdjuster from "./ServingsAdjuster";
import { useShoppingList } from "@/context/ShoppingListContext/utils";
import { useI18n } from "@/i18n/useI18n";

export const IngredientsNutrientsPanel = ({ recipe }: { recipe: Recipe }) => {
  const [activeTab, setActiveTab] = useState(0);

  const hasNutrition = Boolean(
    recipe.nutrition?.calories ||
    recipe.nutrition?.protein ||
    recipe.nutrition?.carbs ||
    recipe.nutrition?.fat,
  );

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        position: { lg: "sticky" },
        top: { lg: 100 },
      }}
    >
      {/* Tabs header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <RenderComponent
          if={hasNutrition}
          then={
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                minHeight: 36,
                "& .MuiTabs-indicator": {
                  backgroundColor: "text.primary",
                },
                "& .MuiTab-root": {
                  minHeight: 36,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "text.secondary",
                  px: 0,
                  mr: 3,
                  "&.Mui-selected": {
                    color: "text.primary",
                  },
                },
              }}
            >
              <Tab label="Ingredients" />
              <Tab label="Nutrition" />
            </Tabs>
          }
          else={<Typography variant="h5">Ingredients</Typography>}
        />
        {/* Units */}
        <UnitsControl />
      </Stack>

      {/* Tab content */}
      <RenderComponent
        if={activeTab === 0}
        then={<IngredientsTabContent recipe={recipe} />}
      />
      <RenderComponent
        if={activeTab === 1 && hasNutrition}
        then={<NutritionTabContent recipe={recipe} />}
      />
    </Paper>
  );
};

const UnitsControl = () => {
  const { unitSystem, toggleUnitSystem } = useUnitConversion();
  const { isActive, toggleWakeLock, isSupported } = useWakeLock();
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip
        label={unitSystem}
        size="small"
        variant="outlined"
        sx={{ textTransform: "capitalize" }}
      />
      <Tooltip
        title={`Switch to ${unitSystem === "metric" ? "imperial" : "metric"}`}
      >
        <IconButton onClick={toggleUnitSystem} size="small">
          <ScaleIcon />
        </IconButton>
      </Tooltip>
      <RenderComponent
        if={isSupported}
        then={
          <Tooltip
            title={isActive ? "Screen will stay on" : "Keep screen awake"}
          >
            <IconButton
              onClick={toggleWakeLock}
              size="small"
              color={isActive ? "primary" : "default"}
            >
              <RenderComponent
                if={isActive}
                then={<WakeLockIcon />}
                else={<WakeLockOffIcon />}
              />
            </IconButton>
          </Tooltip>
        }
      />
    </Stack>
  );
};

const IngredientsTabContent = ({ recipe }: { recipe: Recipe }) => {
  const i18n = useI18n();
  const { addIngredients } = useShoppingList();
  const { convertAmount } = useUnitConversion();

  const {
    adjustedServings,
    incrementServings,
    decrementServings,
    scaleIngredient,
  } = useServingsAdjuster(recipe?.servings || 4);

  const [checkedList, setCheckedList] = useState([]);

  const handleCheck =
    (value: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCheckedList((prev) =>
        event.target.checked
          ? [...prev, value]
          : prev.filter((v) => v !== value),
      );
    };

  // Get all ingredients
  const allIngredients = useMemo(() => {
    if (!recipe) return [];
    return getAllIngredients(recipe.ingredientGroups);
  }, [recipe]);

  // Get all ingredient groups for display
  const ingredientGroups = useMemo(() => {
    if (!recipe) return [];
    if (recipe.ingredientGroups && recipe.ingredientGroups.length > 0) {
      return recipe.ingredientGroups;
    }

    return [];
  }, [recipe]);

  const handleAddToList = () => {
    const scaledIngredients = allIngredients.map((ing) => ({
      ...ing,
      ...scaleIngredient(ing),
    }));

    if (checkedList.length > 0) {
      return addIngredients(
        scaledIngredients.filter((i) => !checkedList.includes(i.id)),
        recipe.id,
        recipe.title,
        recipe.images?.at(0),
        recipe.servings,
      );
    }

    addIngredients(
      scaledIngredients,
      recipe.id,
      recipe.title,
      recipe.images?.at(0),
      recipe.servings,
    );
  };

  return (
    <>
      {/* Servings adjuster */}
      <Box sx={{ mb: 3 }}>
        <ServingsAdjuster
          servings={adjustedServings}
          onIncrement={incrementServings}
          onDecrement={decrementServings}
        />
      </Box>

      <Stack spacing={3}>
        {ingredientGroups.map((group, groupIndex) => (
          <Box key={groupIndex}>
            <RenderComponent
              if={!!group.heading}
              then={
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1.5, color: "text.secondary" }}
                >
                  {group.heading}
                </Typography>
              }
            />
            <FormControl component="fieldset">
              {group.items.map((ingredient, idx) => {
                const scaled = scaleIngredient(ingredient);
                const converted = convertAmount(scaled.amount, scaled.unit);
                return (
                  <Box
                    key={ingredient.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: ".5rem",
                      gap: 2,
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <FormControlLabel
                      key={idx}
                      control={
                        <Checkbox
                          checked={checkedList.includes(ingredient.id)}
                          onChange={handleCheck(ingredient.id)}
                        />
                      }
                      label={
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            color={
                              checkedList.includes(ingredient.id)
                                ? "text.secondary"
                                : "text.primary"
                            }
                          >
                            {converted.amount} {converted.unit}{" "}
                            {ingredient.name}
                            <RenderComponent
                              if={!!ingredient.preparation}
                              then={
                                <Typography
                                  component="span"
                                  color="text.secondary"
                                >
                                  , {ingredient.preparation}
                                </Typography>
                              }
                            />
                          </Typography>
                          <RenderComponent
                            if={!!ingredient.note}
                            then={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {ingredient.note}
                              </Typography>
                            }
                          />
                        </Box>
                      }
                    />
                  </Box>
                );
              })}
            </FormControl>
          </Box>
        ))}
      </Stack>

      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        startIcon={<AddIcon />}
        onClick={handleAddToList}
        sx={{ mt: 3 }}
      >
        {checkedList.length > 0 ? i18n.addUncheckedToList : i18n.addAllToList}
      </Button>
    </>
  );
};

const NutritionTabContent = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
        Per serving
      </Typography>
      <Stack spacing={2}>
        <RenderComponent
          if={!!recipe.nutrition?.calories}
          then={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
                pb: 1.5,
              }}
            >
              <Typography color="text.secondary">Calories</Typography>
              <Typography fontWeight={500}>
                {recipe.nutrition?.calories} kcal
              </Typography>
            </Box>
          }
        />
        <RenderComponent
          if={!!recipe.nutrition?.protein}
          then={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
                pb: 1.5,
              }}
            >
              <Typography color="text.secondary">Protein</Typography>
              <Typography fontWeight={500}>
                {recipe.nutrition?.protein}g
              </Typography>
            </Box>
          }
        />
        <RenderComponent
          if={!!recipe.nutrition?.carbs}
          then={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
                pb: 1.5,
              }}
            >
              <Typography color="text.secondary">Carbohydrates</Typography>
              <Typography fontWeight={500}>
                {recipe.nutrition?.carbs}g
              </Typography>
            </Box>
          }
        />
        <RenderComponent
          if={!!recipe.nutrition?.fat}
          then={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
                pb: 1.5,
              }}
            >
              <Typography color="text.secondary">Fat</Typography>
              <Typography fontWeight={500}>{recipe.nutrition?.fat}g</Typography>
            </Box>
          }
        />
      </Stack>
    </Box>
  );
};
