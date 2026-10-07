import Dialog from "./Dialog";
import Button from "./Button";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", loading }) {
  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
