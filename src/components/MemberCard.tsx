import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { getInitials, type TeamMember } from "@/lib/types";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  member: TeamMember;
  credentialCount: number;
  onDelete: (id: string) => void;
}

export function MemberCard({ member, credentialCount, onDelete }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(member.id);
  };

  return (
    <>
      <Link
        to="/member/$id"
        params={{ id: member.id }}
        className="glass-card glass-card-hover animate-card-in"
        style={{
          padding: 24,
          textDecoration: "none",
          color: "inherit",
          display: "block",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            className="member-avatar"
            style={{ background: member.avatar_color }}
          >
            {getInitials(member.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {member.name}
            </div>
            <div style={{ marginTop: 6 }}>
              <span className="badge">{member.role}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Credentials
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="count-badge">{credentialCount}</span>
            {/* <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="glass-btn glass-btn-icon glass-btn-danger"
              aria-label="Delete member"
              title="Delete member"
            >
              <Trash2 size={14} />
            </button> */}
          </div>
        </div>
      </Link>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Member?"
        message={`Delete ${member.name}? This will also remove all their credentials.`}
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
