import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TeamMember } from "@/lib/types";
import { MemberCard } from "@/components/MemberCard";
import { AddMemberModal } from "@/components/AddMemberModal";

export const Route = createFileRoute("/")({
  component: HomePage,
});

interface MemberWithCount extends TeamMember {
  credential_count: number;
}

async function fetchMembers(): Promise<MemberWithCount[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*, credentials(id)")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((m) => {
    const { credentials, ...rest } = m as TeamMember & {
      credentials: { id: string }[] | null;
    };
    return {
      ...rest,
      credential_count: credentials?.length ?? 0,
    };
  });
}

function HomePage() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const addMember = useMutation({
    mutationFn: async (vals: {
      name: string;
      role: string;
      avatar_color: string;
    }) => {
      const { error } = await supabase.from("team_members").insert(vals);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member added");
      qc.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member deleted");
      qc.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.role ?? "").toLowerCase().includes(q),
    );
  }, [members, query]);

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px 64px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="glass-card"
              style={{
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                background: "rgba(99,102,241,0.25)",
                borderColor: "rgba(99,102,241,0.4)",
              }}
            >
              <KeyRound size={22} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                Information Collector
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                Shared test accounts for the dev team
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="glass-btn glass-btn-primary"
          >
            <Plus size={16} /> Add Member
          </button>
        </header>

        {/* Search */}
        <div
          className="glass-card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            marginBottom: 28,
          }}
        >
          <Search size={16} style={{ color: "var(--text-tertiary)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members by name or role…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
          <span
            className="badge"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Users size={11} /> {members.length}
          </span>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            style={{
              color: "var(--text-secondary)",
              padding: 48,
              textAlign: "center",
            }}
          >
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: 56, textAlign: "center" }}
          >
            <Users
              size={36}
              style={{ color: "var(--text-tertiary)", marginBottom: 12 }}
            />
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>
              {members.length === 0 ? "No members yet" : "No matches"}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                marginTop: 6,
                fontSize: 14,
              }}
            >
              {members.length === 0
                ? "Add your first team member to start storing credentials."
                : "Try a different search term."}
            </p>
            {members.length === 0 && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="glass-btn glass-btn-primary"
                style={{ marginTop: 20 }}
              >
                <Plus size={16} /> Add Member
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            }}
          >
            {filtered.map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                credentialCount={m.credential_count}
                onDelete={(id) => deleteMember.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onSubmit={async (data) => {
            await addMember.mutateAsync(data);
          }}
        />
      )}
    </div>
  );
}
