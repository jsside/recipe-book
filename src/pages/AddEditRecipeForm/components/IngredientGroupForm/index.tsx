import {
  TextField,
  IconButton,
  Stack,
  Button,
  Paper,
  Divider,
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

const createEmptyIngredient = (): IngredientFormItem => ({
  tempId: crypto.randomUUID(),
  name: "",
  amount: "",
  unit: "",
  preparation: "",
  note: "",
});

const createEmptyGroup = (): IngredientGroupFormItem => ({
  tempId: crypto.randomUUID(),
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
          key={group.tempId}
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
                  key={ingredient.tempId}
                  direction="row"
                  spacing={1}
                  alignItems="flex-start"
                  sx={{ pl: 4 }}
                >
                  <TextField
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
                  <TextField
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(
                        groupIndex,
                        ingredientIndex,
                        "name",
                        e.target.value,
                      )
                    }
                    placeholder="Ingredient"
                    size="small"
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                  <TextField
                    value={ingredient.preparation || ""}
                    onChange={(e) =>
                      updateIngredient(
                        groupIndex,
                        ingredientIndex,
                        "preparation",
                        e.target.value,
                      )
                    }
                    placeholder="Prep (e.g., diced)"
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <TextField
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
