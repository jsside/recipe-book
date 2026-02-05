import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { CancelConfirmDialogProps } from "./interfaces";

export function CancelConfirmDialog({
  open,
  onClose,
  onConfirm,
  formik,
}: CancelConfirmDialogProps) {
  const hasChanges = formik.dirty;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Discard changes?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {hasChanges
            ? "You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
            : "Are you sure you want to cancel?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Keep editing
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}
