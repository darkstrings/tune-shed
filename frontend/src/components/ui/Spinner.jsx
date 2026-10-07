import { cn } from "../../lib/utils";

export default function Spinner({ className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent", className)}
    />
  );
}

/** Full-section loader: a little vibrating "string". */
export function PageSpinner({ label = "Tuning up…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-muted" role="status">
      <svg width="120" height="24" viewBox="0 0 120 24" aria-hidden="true" className="text-accent">
        <path d="M0 12 Q 30 2 60 12 T 120 12" fill="none" stroke="currentColor" strokeWidth="2">
          <animate
            attributeName="d"
            dur="0.5s"
            repeatCount="indefinite"
            values="M0 12 Q 30 2 60 12 T 120 12;M0 12 Q 30 22 60 12 T 120 12;M0 12 Q 30 2 60 12 T 120 12"
          />
        </path>
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}
