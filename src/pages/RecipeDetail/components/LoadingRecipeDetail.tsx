import { Container, Skeleton, Stack, Typography } from "@mui/material";

export const LoadingRecipeDetail = () => {
  return (
    <Container sx={{ py: 10, textAlign: "center" }}>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={"50%"} height={400} />

          <Stack spacing={2} width={"30%"}>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Typography variant="h1">
              <Skeleton />
            </Typography>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={"50%"} height={500} />
          <Skeleton variant="rounded" width={"50%"} height={500} />
        </Stack>
      </Stack>
    </Container>
  );
};
