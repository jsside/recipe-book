import {
  TextField,
  IconButton,
  Stack,
  Button,
  Paper,
  Divider,
  Autocomplete,
  styled,
  lighten,
  darken,
  createFilterOptions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  DragHandle as DragIcon,
} from "@mui/icons-material";
import {
  IngredientGroupFormProps,
  IngredientGroupFormItem,
  IngredientFormItem,
} from "./interfaces";
import {
  IngredientRecord,
  useListIngredients,
} from "@/hooks/useListIngredients";
import i18next from "i18next";
import { useI18n } from "@/i18n/useI18n";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
  ...theme.applyStyles("dark", {
    backgroundColor: darken(theme.palette.primary.main, 0.8),
  }),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

const createEmptyIngredient = (): IngredientFormItem => ({
  name: "",
  amount: "",
  unit: "",
  preparation: "",
  note: "",
});

const createEmptyGroup = (): IngredientGroupFormItem => ({
  heading: "",
  items: [createEmptyIngredient()],
});

export function IngredientGroupForm({
  groups,
  onChange,
}: IngredientGroupFormProps) {
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

  const addIngredient = (groupIndex: number) => {
    const updated = [...groups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      items: [...updated[groupIndex].items, createEmptyIngredient()],
    };
    onChange(updated);
  };

  const removeIngredient = (groupIndex: number, ingredientIndex: number) => {
    const updated = [...groups];
    if (updated[groupIndex].items.length > 1) {
      updated[groupIndex] = {
        ...updated[groupIndex],
        items: updated[groupIndex].items.filter(
          (_, i) => i !== ingredientIndex,
        ),
      };
      onChange(updated);
    }
  };

  const updateIngredient = (
    groupIndex: number,
    ingredientIndex: number,
    field: keyof IngredientFormItem,
    value: string,
  ) => {
    const updated = [...groups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      items: updated[groupIndex].items.map((item, i) =>
        i === ingredientIndex ? { ...item, [field]: value } : item,
      ),
    };
    onChange(updated);
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
                placeholder="Group heading (optional, e.g., 'For the sauce')"
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

            {/* Ingredients */}
            <Stack spacing={1.5}>
              {group.items.map((ingredient, ingredientIndex) => (
                <Stack
                  key={ingredientIndex}
                  direction="row"
                  spacing={1}
                  alignItems="flex-start"
                  sx={{ pl: 4 }}
                >
                  <TextField
                    variant="standard"
                    value={ingredient.amount}
                    onChange={(e) =>
                      updateIngredient(
                        groupIndex,
                        ingredientIndex,
                        "amount",
                        e.target.value,
                      )
                    }
                    placeholder="Qty"
                    size="small"
                    sx={{ width: 70 }}
                  />
                  <TextField
                    variant="standard"
                    value={ingredient.unit}
                    onChange={(e) =>
                      updateIngredient(
                        groupIndex,
                        ingredientIndex,
                        "unit",
                        e.target.value,
                      )
                    }
                    placeholder="Unit"
                    size="small"
                    sx={{ width: 80 }}
                  />
                  <IngredientAutocomplete
                    ingredient={ingredient}
                    updateIngredient={updateIngredient}
                    groupIndex={groupIndex}
                    ingredientIndex={ingredientIndex}
                  />
                  <TextField
                    variant="standard"
                    value={ingredient.preparation || ""}
                    onChange={(e) =>
                      updateIngredient(
                        groupIndex,
                        ingredientIndex,
                        "preparation",
                        e.target.value,
                      )
                    }
                    placeholder="Prep"
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <TextField
                    variant="standard"
                    value={ingredient.note || ""}
                    onChange={(e) =>
                      updateIngredient(
                        groupIndex,
                        ingredientIndex,
                        "note",
                        e.target.value,
                      )
                    }
                    placeholder="Note"
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <IconButton
                    onClick={() =>
                      removeIngredient(groupIndex, ingredientIndex)
                    }
                    size="small"
                    disabled={group.items.length === 1}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Button
              startIcon={<AddIcon />}
              onClick={() => addIngredient(groupIndex)}
              size="small"
              sx={{ alignSelf: "flex-start", ml: 4 }}
            >
              Add Ingredient
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
        Add Ingredient Group
      </Button>
    </Stack>
  );
}

const IngredientAutocomplete = ({
  ingredient,
  updateIngredient,
  groupIndex,
  ingredientIndex,
}: {
  ingredient: IngredientFormItem;
  updateIngredient: (
    groupIndex: number,
    ingredientIndex: number,
    field: "name" | "note" | "category" | "amount" | "unit" | "preparation",
    value: string,
  ) => void;
  groupIndex: number;
  ingredientIndex: number;
}) => {
  const i18n = useI18n();
  const { data: options = [], isLoading: isLoadingOptions } =
    useListIngredients();

  function handleChange(event, newValue) {
    if (typeof newValue === "string") {
      updateIngredient(groupIndex, ingredientIndex, "name", newValue);
    } else if (newValue && newValue.name) {
      updateIngredient(groupIndex, ingredientIndex, "name", newValue.name);
    } else {
      updateIngredient(groupIndex, ingredientIndex, "name", "");
    }
  }
  function handleGetOptionLabel(option) {
    if (typeof option === "string") return option;
    if (option.id === -1) return `Add "${option.name}"`;
    return option.name;
  }

  function handleFilterOptions(options, params) {
    const filtered = createFilterOptions<IngredientRecord>()(options, params);
    const { inputValue } = params;

    const isExisting = options.some(
      (option) => inputValue.toLowerCase() === option.name.toLowerCase(),
    );

    if (inputValue !== "" && !isExisting) {
      filtered.push({
        name: inputValue,
        id: -1, // Temporary ID to indicate a "new" item
        category: "New ingredient",
      } as IngredientRecord);
    }

    return filtered;
  }

  return (
    <Autocomplete
      value={ingredient.name || ""}
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      // Smart matching props
      autoHighlight // (automatically highlights the first match as user types)
      autoSelect // (selects that highlighted match on Enter or Tab)
      options={options}
      // Create new logic
      filterOptions={handleFilterOptions}
      onChange={handleChange}
      getOptionLabel={handleGetOptionLabel}
      groupBy={(option) => option.category || "Other"}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder={i18n.ingredient}
          size="small"
        />
      )}
      loading={isLoadingOptions}
      sx={{ width: 300 }}
    />
  );
};
