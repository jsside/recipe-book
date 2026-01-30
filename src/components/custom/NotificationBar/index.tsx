import { Alert, Box, Collapse, IconButton, Stack } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useNotification } from "@/context/NotificationContext";

export function NotificationBar() {
  const { notifications, hideNotification } = useNotification();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 80,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "100%",
        maxWidth: 500,
        px: 2,
      }}
    >
      <Stack spacing={1}>
        {notifications.map((notification) => (
          <Collapse key={notification.id} in={true}>
            <Alert
              severity={notification.type}
              action={
                <IconButton
                  size="small"
                  onClick={() => hideNotification(notification.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: 2,
              }}
            >
              {notification.message}
            </Alert>
          </Collapse>
        ))}
      </Stack>
    </Box>
  );
}
