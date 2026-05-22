import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export function SuccessDialog({
  open,
  title,
  message,
  buttonText = "OK",
  onClose,
}: SuccessDialogProps) {
  if (!open) return null;

  return (
    <div className="glass-modal-overlay" onClick={onClose}>
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
              background: "rgba(34,197,94,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircle
              size={20}
              style={{ color: "rgba(100,230,130,0.95)" }}
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
          <button
            type="button"
            onClick={onClose}
            className="glass-btn glass-btn-primary"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
