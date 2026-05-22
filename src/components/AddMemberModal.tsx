import { useState } from "react";
import { X } from "lucide-react";
import { AVATAR_COLORS } from "@/lib/types";

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    role: string;
    avatar_color: string;
  }) => Promise<void>;
}

export function AddMemberModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Developer");
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        role: role.trim() || "Developer",
        avatar_color: color,
      });
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
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Add Team Member
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
            <label className="form-label">Full Name *</label>
            <input
              className="glass-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahim Khan"
              maxLength={100}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <input
              className="glass-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Developer"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Color</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
              {AVATAR_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`color-swatch ${color === c ? "selected" : ""}`}
                  style={{ background: c }}
                  aria-label={`Choose ${c}`}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 24,
            }}
          >
            <button type="button" onClick={onClose} className="glass-btn">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="glass-btn glass-btn-primary"
            >
              {submitting ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
