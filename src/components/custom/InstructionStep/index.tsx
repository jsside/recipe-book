import { Box, Stack, Typography } from "@mui/material";
import { InstructionStepProps } from "./interfaces";

export default function InstructionStep({
  stepNumber,
  instruction,
  isActive,
  onClick,
}: InstructionStepProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        bgcolor: isActive ? "action.hover" : "transparent",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: isActive ? "secondary.main" : "background.paper",
          color: isActive ? "background.paper" : "text.primary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          transition: "all 0.2s ease",
        }}
      >
        {stepNumber}
      </Box>
      <Typography
        sx={{
          pt: 0.5,
          fontSize: "1.1rem",
          transition: "color 0.2s ease",
        }}
      >
        {instruction}
      </Typography>
    </Stack>
  );
}
