import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Stack,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { ScaleIcon } from "lucide-react";
import RenderComponent from "@/components/helpers/renderComponent";
import { useUnitConversion } from "@/hooks/useUnitConversion";
import {
  ShoppingItem,
  ShoppingRecipe,
} from "@/context/ShoppingListContext/interfaces";
import { useShoppingList } from "@/context/ShoppingListContext/utils";
import { RecipeListItem } from "./RecipeListItem";
import { AdjustServingsModal } from "./AdjustServingsModal";

export function ShoppingListDrawer() {
  const {
    items,
    recipes,
    isOpen,
    setIsOpen,
    clearList,
    clearChecked,
    removeRecipe,
    updateRecipeServings,
    toggleItem,
  } = useShoppingList();
  const { unitSystem, toggleUnitSystem, convertAmount } = useUnitConversion();

  const [activeTab, setActiveTab] = useState(0);
  const [adjustModalRecipe, setAdjustModalRecipe] =
    useState<ShoppingRecipe | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAdjustServings = (recipe: ShoppingRecipe) => {
    setAdjustModalRecipe(recipe);
  };

  const handleSaveServings = (recipeId: number, newServings: number) => {
    updateRecipeServings(recipeId, newServings);
  };

  // Group items by recipe with scaling based on adjusted servings
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.recipeId]) {
        acc[item.recipeId] = {
          recipeTitle: item.recipeTitle,
          items: [],
        };
      }
      acc[item.recipeId].items.push(item);
      return acc;
    },
    {} as Record<string, { recipeTitle: string; items: ShoppingItem[] }>,
  );

  const checkedCount = items.filter((item) => item.checked).length;

  // Scale ingredient amount based on recipe servings
  const getScaledAmount = (item: ShoppingItem) => {
    const recipe = recipes.find((r) => r.recipeId === item.recipeId);
    if (!recipe) return item.amount;

    const scaleFactor = recipe.servings / recipe.originalServings;
    const numericAmount = parseFloat(item.amount);

    if (isNaN(numericAmount)) return item.amount;

    const scaledAmount = numericAmount * scaleFactor;
    if (scaledAmount === Math.floor(scaledAmount)) {
      return scaledAmount.toString();
    }
    return scaledAmount.toFixed(2).replace(/\.?0+$/, "");
  };

  return (
    <>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box
          sx={{
            width: { xs: "100vw", sm: 380 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6">Shopping list</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <RenderComponent
              if={items.length === 0}
              then={<EmptyListContent />}
              else={
                <Stack spacing={3}>
                  <Stack direction="row" justifyContent={"space-between"}>
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
                      <Tab label="Recipes" />
                      <Tab label="Ingredients" />
                    </Tabs>
                    <Tooltip
                      title={`Switch to ${unitSystem === "metric" ? "imperial" : "metric"}`}
                    >
                      <IconButton onClick={toggleUnitSystem} size="small">
                        <ScaleIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  {/* Recipes Tab */}
                  <RenderComponent
                    if={activeTab === 0}
                    then={
                      <Box>
                        {recipes.map((recipe) => (
                          <RecipeListItem
                            key={recipe.recipeId}
                            recipe={recipe}
                            onAdjustServings={handleAdjustServings}
                            onRemove={removeRecipe}
                          />
                        ))}
                      </Box>
                    }
                  />

                  {/* Ingredients Tab */}
                  <RenderComponent
                    if={activeTab === 1}
                    then={
                      <>
                        {Object.entries(groupedItems).map(
                          ([recipeId, { recipeTitle, items: recipeItems }]) => (
                            <Box key={recipeId}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  color: "text.secondary",
                                  mb: 1,
                                  textTransform: "uppercase",
                                  fontSize: "0.75rem",
                                  letterSpacing: 0.5,
                                }}
                              >
                                {recipeTitle}
                              </Typography>
                              <List dense disablePadding>
                                {recipeItems.map((item) => {
                                  const scaledAmount = getScaledAmount(item);
                                  const converted = convertAmount(scaledAmount, item.unit);
                                  return (
                                    <ShoppingListItem
                                      key={`${item.recipeId}-${item.id}`}
                                      item={item}
                                      scaledAmount={converted.amount}
                                      convertedUnit={converted.unit}
                                      onToggle={() =>
                                        toggleItem(item.id, item.recipeId)
                                      }
                                    />
                                  );
                                })}
                              </List>
                            </Box>
                          ),
                        )}
                      </>
                    }
                  />
                </Stack>
              }
            />
          </Box>

          {/* Footer */}
          <RenderComponent
            if={items.length > 0}
            then={
              <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                <Stack spacing={1}>
                  <RenderComponent
                    if={checkedCount > 0}
                    then={
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={clearChecked}
                        size="small"
                      >
                        Clear {checkedCount} checked item
                        {checkedCount > 1 ? "s" : ""}
                      </Button>
                    }
                  />
                  <Button
                    fullWidth
                    variant="text"
                    color="error"
                    onClick={clearList}
                    size="small"
                  >
                    Clear all
                  </Button>
                </Stack>
              </Box>
            }
          />
        </Box>
      </Drawer>

      {/* Adjust Servings Modal */}
      <RenderComponent
        if={!!adjustModalRecipe}
        then={
          <AdjustServingsModal
            open={!!adjustModalRecipe}
            onClose={() => setAdjustModalRecipe(null)}
            recipe={adjustModalRecipe!}
            onSave={handleSaveServings}
          />
        }
      />
    </>
  );
}

const EmptyListContent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Your list is empty
      </Typography>
      <Typography variant="body2">
        Add ingredients from recipes to get started
      </Typography>
    </Box>
  );
};

interface ShoppingListItemProps {
  item: ShoppingItem;
  scaledAmount: string;
  convertedUnit: string;
  onToggle: () => void;
}

const ShoppingListItem = ({
  item,
  scaledAmount,
  convertedUnit,
  onToggle,
}: ShoppingListItemProps) => {
  return (
    <ListItem
      disablePadding
      sx={{
        py: 0.5,
        opacity: item.checked ? 0.5 : 1,
      }}
      secondaryAction={
        <Checkbox checked={item.checked} onChange={onToggle} size="small" />
      }
    >
      <ListItemText
        primary={
          <Typography
            variant="body2"
            sx={{
              textDecoration: item.checked ? "line-through" : "none",
            }}
          >
            {scaledAmount} {convertedUnit} {item.name}
          </Typography>
        }
      />
    </ListItem>
  );
};
