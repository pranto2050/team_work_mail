import { useState } from "react";
import { Plus, X } from "lucide-react";

export interface CredentialFormValues {
  label: string;
  full_name: string;
  email: string;
  password: string;
}

const empty: CredentialFormValues = {
  label: "",
  full_name: "",
  email: "",
  password: "",
};

interface Props {
  onSubmit: (data: CredentialFormValues) => Promise<void>;
}

export function AddCredentialForm({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [v, setV] = useState<CredentialFormValues>(empty);
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
      setV(empty);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass-btn glass-btn-primary"
      >
        <Plus size={16} /> Add Credential
      </button>
    );
  }

  return (
    <div
      className="glass-card animate-card-in"
      style={{ padding: 24, marginBottom: 8 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
          New Credential
        </h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setV(empty);
          }}
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
            placeholder="e.g. Gmail Test Account"
            maxLength={100}
            required
            autoFocus
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
              placeholder="Test User One"
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
              placeholder="test@example.com"
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
              placeholder="Strong password"
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
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setV(empty);
            }}
            className="glass-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !v.label.trim() || !v.password}
            className="glass-btn glass-btn-primary"
          >
            {submitting ? "Saving..." : "Save Credential"}
          </button>
        </div>
      </form>
    </div>
  );
}
