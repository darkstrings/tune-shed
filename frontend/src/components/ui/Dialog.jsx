import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

/** Accessible modal built on the native <dialog> element (focus trap + Esc for free). */
export default function Dialog({ open, onClose, title, description, size = "md", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-card border border-border bg-surface p-0 text-fg shadow-2xl",
        "backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-fade-up",
        size === "sm" && "max-w-md",
        size === "md" && "max-w-xl",
        size === "lg" && "max-w-3xl",
      )}>
      {open && (
        <div className="flex max-h-[85dvh] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-fg"
              aria-label="Close">
              <X className="size-5" />
            </button>
          </header>
          <div className="overflow-y-auto px-6 py-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}
