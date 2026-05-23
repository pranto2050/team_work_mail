import { useState } from "react";
import {
  Mail,
  User,
  KeyRound,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Credential } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { PasswordToggle } from "./PasswordToggle";
import { EditCredentialModal } from "./EditCredentialModal";
import { ConfirmDialog } from "./ConfirmDialog";
import type { CredentialFormValues } from "./AddCredentialForm";

interface Props {
  credential: Credential;
  onUpdate: (id: string, data: CredentialFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function CredentialCard({ credential, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    await onDelete(credential.id);
  };

  return (
    <>
      <div
        className="glass-card animate-card-in"
        style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {credential.label}
        </div>

        <div>
          {credential.full_name && (
            <div className="field-chip">
              <span className="field-chip-label">
                <User size={12} /> Name
              </span>
              <span className="field-chip-value" style={{ fontFamily: "inherit" }}>
                {credential.full_name}
              </span>
            </div>
          )}

          {credential.email && (
            <div className="field-chip">
              <span className="field-chip-label">
                <Mail size={12} /> Email
              </span>
              <span className="field-chip-value">{credential.email}</span>
              <CopyButton value={credential.email} label="Email" />
            </div>
          )}

          <div className="field-chip">
            <span className="field-chip-label">
              <KeyRound size={12} /> Pass
            </span>
            <PasswordToggle password={credential.password} />
          </div>
        </div>

        <div className="glass-divider" style={{ margin: "4px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
            Updated {formatDate(credential.updated_at)}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              className="glass-btn glass-btn-icon"
              onClick={() => setEditing(true)}
              aria-label="Edit"
              title="Edit"
            >

              {/* Delete Barton or Barton for Delete */}
              <Pencil size={14} />
            </button>
            {/* <button
              type="button"
              className="glass-btn glass-btn-icon glass-btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 size={14} />
            </button> */}
          </div>
        </div>
      </div>

      {editing && (
        <EditCredentialModal
          credential={credential}
          onClose={() => setEditing(false)}
          onSubmit={(data) => onUpdate(credential.id, data)}
        />
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Credential?"
        message={`Are you sure you want to delete "${credential.label}"? This can't be undone.`}
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
