import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="glass-modal-overlay" onClick={onCancel}>
      <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background:
                confirmVariant === "danger"
                  ? "rgba(239,68,68,0.2)"
                  : "rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink:  0,
            }}
          >
            <AlertTriangle
              size={20}
              style={{
                color:
                  confirmVariant === "danger"
                    ? "rgba(255,120,120,0.95)"
                    : "rgba(165,170,255,0.95)",
              }}
            />
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>
        </div>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button type="button" onClick={onCancel} className="glass-btn">
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`glass-btn ${
              confirmVariant === "danger"
                ? "glass-btn-danger"
                : "glass-btn-primary"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
