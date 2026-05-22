import { useState } from "react";
import { X } from "lucide-react";
import type { Credential } from "@/lib/types";
import type { CredentialFormValues } from "./AddCredentialForm";

interface Props {
  credential: Credential;
  onClose: () => void;
  onSubmit: (data: CredentialFormValues) => Promise<void>;
}

export function EditCredentialModal({ credential, onClose, onSubmit }: Props) {
  const [v, setV] = useState<CredentialFormValues>({
    label: credential.label,
    full_name: credential.full_name ?? "",
    email: credential.email ?? "",
    password: credential.password,
  });
  const [submitting, setSubmitting] = useState(false);

  const update =
    (k: keyof CredentialFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setV((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.label.trim() || !v.password) return;
    setSubmitting(true);
    try {
      await onSubmit(v);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-modal-overlay" onClick={onClose}>
      <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            Edit Credential
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="glass-btn glass-btn-icon"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Label / Title *</label>
            <input
              className="glass-input"
              value={v.label}
              onChange={update("label")}
              maxLength={100}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="glass-input"
                value={v.full_name}
                onChange={update("full_name")}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="glass-input"
                type="email"
                value={v.email}
                onChange={update("email")}
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                className="glass-input"
                type="text"
                value={v.password}
                onChange={update("password")}
                maxLength={200}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button type="button" onClick={onClose} className="glass-btn">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !v.label.trim() || !v.password}
              className="glass-btn glass-btn-primary"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
