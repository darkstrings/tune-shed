import { Link } from "react-router";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

const STEPS = [
  { label: "Sign in", to: "/login" },
  { label: "Shipping", to: "/shipping" },
  { label: "Payment", to: "/payment" },
  { label: "Review", to: "/placeorder" },
];

/** current: index of the active step (0–3). */
export default function CheckoutSteps({ current }) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center gap-2 text-sm">
        {STEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const content = (
            <>
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold",
                  done && "border-accent bg-accent text-accent-fg",
                  active && "border-accent text-accent",
                  !done && !active && "border-border text-subtle",
                )}>
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn("hidden sm:inline", active ? "font-semibold" : "text-muted")}>{s.label}</span>
            </>
          );
          return (
            <li key={s.label} className="flex flex-1 items-center gap-2 last:flex-none" aria-current={active ? "step" : undefined}>
              {done && i > 0 ? (
                <Link to={s.to} className="flex items-center gap-2 hover:opacity-80">
                  {content}
                </Link>
              ) : (
                <span className="flex items-center gap-2">{content}</span>
              )}
              {i < STEPS.length - 1 && <span className={cn("h-px flex-1", done ? "bg-accent" : "bg-border")} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
