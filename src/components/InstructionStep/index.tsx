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
        bgcolor: isActive ? "primary.main" : "transparent",
        "&:hover": {
          bgcolor: isActive ? "primary.main" : "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: isActive ? "background.paper" : "primary.main",
          color: isActive ? "primary.main" : "text.primary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          flexShrink: 0,
          transition: "all 0.2s ease",
        }}
      >
        {stepNumber}
      </Box>
      <Typography
        sx={{
          pt: 0.5,
          fontSize: "1.1rem",
          color: isActive ? "background.paper" : "text.primary",
          transition: "color 0.2s ease",
        }}
      >
        {instruction}
      </Typography>
    </Stack>
  );
}
