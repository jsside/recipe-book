import { useState } from "react";
import { Box, Typography, Tab, Tabs, Stack } from "@mui/material";
import RenderComponent from "@/components/helpers/renderComponent";
import { NutritionTabsProps } from "./interfaces";

export default function NutritionTabs({ nutrition }: NutritionTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const hasNutrition =
    nutrition?.calories ||
    nutrition?.protein ||
    nutrition?.carbs ||
    nutrition?.fat;

  if (!hasNutrition) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          minHeight: 40,
          "& .MuiTabs-indicator": {
            backgroundColor: "text.primary",
          },
          "& .MuiTab-root": {
            minHeight: 40,
            textTransform: "none",
            fontWeight: 500,
            color: "text.secondary",
            "&.Mui-selected": {
              color: "text.primary",
            },
          },
        }}
      >
        <Tab label="Ingredients" />
        <Tab label="Nutrition" />
      </Tabs>

      <RenderComponent
        if={activeTab === 1}
        then={
          <Box sx={{ py: 3 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Per serving
            </Typography>
            <Stack spacing={2}>
              <RenderComponent
                if={!!nutrition?.calories}
                then={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pb: 1,
                    }}
                  >
                    <Typography color="text.secondary">Calories</Typography>
                    <Typography fontWeight={500}>
                      {nutrition?.calories} kcal
                    </Typography>
                  </Box>
                }
              />
              <RenderComponent
                if={!!nutrition?.protein}
                then={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pb: 1,
                    }}
                  >
                    <Typography color="text.secondary">Protein</Typography>
                    <Typography fontWeight={500}>
                      {nutrition?.protein}g
                    </Typography>
                  </Box>
                }
              />
              <RenderComponent
                if={!!nutrition?.carbs}
                then={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pb: 1,
                    }}
                  >
                    <Typography color="text.secondary">
                      Carbohydrates
                    </Typography>
                    <Typography fontWeight={500}>
                      {nutrition?.carbs}g
                    </Typography>
                  </Box>
                }
              />
              <RenderComponent
                if={!!nutrition?.fat}
                then={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pb: 1,
                    }}
                  >
                    <Typography color="text.secondary">Fat</Typography>
                    <Typography fontWeight={500}>{nutrition?.fat}g</Typography>
                  </Box>
                }
              />
            </Stack>
          </Box>
        }
      />
    </Box>
  );
}
