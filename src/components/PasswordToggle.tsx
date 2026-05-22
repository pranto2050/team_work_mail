import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CopyButton } from "./CopyButton";

export function PasswordToggle({ password }: { password: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <span className={`field-chip-value ${visible ? "" : "password-blur"}`}>
        {password}
      </span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="glass-btn glass-btn-icon"
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <CopyButton value={password} label="Password" />
    </div>
  );
}
