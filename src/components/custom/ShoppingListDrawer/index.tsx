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
import { useState } from "react";
import RenderComponent from "@/components/helpers/renderComponent";
import { useUnitConversion } from "@/hooks/useUnitConversion";
import { ScaleIcon } from "lucide-react";
import { ShoppingItem } from "@/context/ShoppingListContext/interfaces";
import { useShoppingList } from "@/context/ShoppingListContext/utils";

export function ShoppingListDrawer() {
  const { items, isOpen, setIsOpen, clearList, clearChecked } =
    useShoppingList();
  const { unitSystem, toggleUnitSystem } = useUnitConversion();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Group items by recipe
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
    {} as Record<string, { recipeTitle: string; items: typeof items }>,
  );

  const checkedCount = items.filter((item) => item.checked).length;

  return (
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
          <Typography variant="h6" fontFamily='"Fraunces", serif'>
            Shopping list
          </Typography>
          <IconButton onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {items.length === 0 ? (
            <EmptyListContent />
          ) : (
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
                      fontFamily: '"Fraunces", serif',
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
              {/* Tab content */}
              <RenderComponent if={activeTab === 0} then={<></>} />
              <RenderComponent
                if={activeTab === 1}
                then={Object.entries(groupedItems).map(
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
                        {recipeItems.map((item) => (
                          <ShoppingListItem item={item} />
                        ))}
                      </List>
                    </Box>
                  ),
                )}
              />
            </Stack>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <Stack spacing={1}>
              {checkedCount > 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearChecked}
                  size="small"
                >
                  Clear {checkedCount} checked item{checkedCount > 1 ? "s" : ""}
                </Button>
              )}
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
        )}
      </Box>
    </Drawer>
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

const ShoppingListItem = ({ item }: { item: ShoppingItem }) => {
  const { toggleItem } = useShoppingList();

  const { convertAmount } = useUnitConversion();
  // TODO: convert in list
  //   const {
  //     adjustedServings,
  //     incrementServings,
  //     decrementServings,
  //     scaleIngredient,
  //   } = useServingsAdjuster(recipe?.servings || 4);

  // const scaled = scaleIngredient(ingredient);
  // const converted = convertAmount(scaled.amount, scaled.unit);
  return (
    <ListItem
      key={`${item.recipeId}-${item.id}`}
      disablePadding
      sx={{
        py: 0.5,
        opacity: item.checked ? 0.5 : 1,
      }}
      secondaryAction={
        <Checkbox
          checked={item.checked}
          onChange={() => toggleItem(item.id, item.recipeId)}
          size="small"
        />
      }
    >
      <ListItemText
        primary={
          <Typography variant="body2">
            {item.amount}
            {item.unit} {item.name}
          </Typography>
        }
      />
    </ListItem>
  );
};
