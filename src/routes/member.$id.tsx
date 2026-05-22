import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, KeyRound, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getInitials, type Credential, type TeamMember } from "@/lib/types";
import { CredentialCard } from "@/components/CredentialCard";
import {
  AddCredentialForm,
  type CredentialFormValues,
} from "@/components/AddCredentialForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const Route = createFileRoute("/member/$id")({
  component: MemberPage,
});

interface MemberWithCreds {
  member: TeamMember;
  credentials: Credential[];
}

async function fetchMember(id: string): Promise<MemberWithCreds> {
  const [memberRes, credsRes] = await Promise.all([
    supabase.from("team_members").select("*").eq("id", id).single(),
    supabase
      .from("credentials")
      .select("*")
      .eq("member_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (memberRes.error) throw memberRes.error;
  if (credsRes.error) throw credsRes.error;
  return {
    member: memberRes.data as TeamMember,
    credentials: (credsRes.data ?? []) as Credential[],
  };
}

function toNullable(v: string): string | null {
  const t = v.trim();
  return t === "" ? null : t;
}

function MemberPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showDeleteMemberConfirm, setShowDeleteMemberConfirm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["member", id],
    queryFn: () => fetchMember(id),
  });

  const addCred = useMutation({
    mutationFn: async (v: CredentialFormValues) => {
      const { error } = await supabase.from("credentials").insert({
        member_id: id,
        label: v.label.trim(),
        full_name: toNullable(v.full_name),
        email: toNullable(v.email),
        password: v.password,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Credential added");
      qc.invalidateQueries({ queryKey: ["member", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateCred = useMutation({
    mutationFn: async ({
      credId,
      v,
    }: {
      credId: string;
      v: CredentialFormValues;
    }) => {
      const { error } = await supabase
        .from("credentials")
        .update({
          label: v.label.trim(),
          full_name: toNullable(v.full_name),
          email: toNullable(v.email),
          password: v.password,
        })
        .eq("id", credId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Credential updated");
      qc.invalidateQueries({ queryKey: ["member", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteCred = useMutation({
    mutationFn: async (credId: string) => {
      const { error } = await supabase
        .from("credentials")
        .delete()
        .eq("id", credId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Credential deleted");
      qc.invalidateQueries({ queryKey: ["member", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMember = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member deleted");
      qc.invalidateQueries({ queryKey: ["members"] });
      navigate({ to: "/" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary)",
        }}
      >
        Loading…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Member not found.</p>
        <Link
          to="/"
          className="glass-btn glass-btn-primary"
          style={{ marginTop: 16 }}
        >
          <ArrowLeft size={16} /> Back home
        </Link>
      </div>
    );
  }

  const { member, credentials } = data;

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px 64px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Back nav */}
        <div style={{ marginBottom: 24 }}>
          <Link to="/" className="glass-btn">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>

        {/* Member header */}
        <div
          className="glass-card"
          style={{
            padding: 28,
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            className="member-avatar member-avatar-lg"
            style={{ background: member.avatar_color }}
          >
            {getInitials(member.name)}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              {member.name}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              <span className="badge">{member.role}</span>
              <span
                className="badge badge-accent"
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <KeyRound size={11} /> {credentials.length} credential
                {credentials.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="glass-btn glass-btn-danger"
            onClick={() => setShowDeleteMemberConfirm(true)}
          >
            <Trash2 size={14} /> Delete member
          </button>
        </div>

        {/* Add credential */}
        <div style={{ marginBottom: 18 }}>
          <AddCredentialForm
            onSubmit={async (v) => {
              await addCred.mutateAsync(v);
            }}
          />
        </div>

        {/* Credentials grid */}
        {credentials.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: 56, textAlign: "center" }}
          >
            <KeyRound
              size={36}
              style={{ color: "var(--text-tertiary)", marginBottom: 12 }}
            />
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>
              No credentials yet
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                marginTop: 6,
                fontSize: 14,
              }}
            >
              Add the first credential for {member.name.split(" ")[0]}.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            }}
          >
            {credentials.map((c) => (
              <CredentialCard
                key={c.id}
                credential={c}
                onUpdate={(credId, v) =>
                  updateCred.mutateAsync({ credId, v })
                }
                onDelete={(credId) => deleteCred.mutateAsync(credId)}
              />
            ))}
          </div>
        )}

        <ConfirmDialog
          open={showDeleteMemberConfirm}
          title="Delete Member?"
          message={`Delete ${member.name}? This will also remove all ${credentials.length} credential(s).`}
          confirmText="Yes, Delete"
          cancelText="No, Cancel"
          confirmVariant="danger"
          onConfirm={() => {
            setShowDeleteMemberConfirm(false);
            deleteMember.mutate();
          }}
          onCancel={() => setShowDeleteMemberConfirm(false)}
        />
      </div>
    </div>
  );
}
