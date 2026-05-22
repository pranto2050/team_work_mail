export interface TeamMember {
  id: string;
  name: string;
  avatar_color: string;
  role: string;
  created_at: string;
}

export interface Credential {
  id: string;
  member_id: string;
  label: string;
  full_name: string | null;
  email: string | null;
  username: string | null;
  password: string;
  website_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const AVATAR_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#06b6d4", // Cyan
];

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
