import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { SuccessDialog } from "./SuccessDialog";

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setShowSuccess(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // silently fail
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="glass-btn glass-btn-icon"
        aria-label={`Copy ${label || "value"}`}
        title={`Copy ${label || "value"}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>

      <SuccessDialog
        open={showSuccess}
        title="Copied!"
        message={`${label || "Value"} copied to clipboard successfully.`}
        buttonText="OK"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
