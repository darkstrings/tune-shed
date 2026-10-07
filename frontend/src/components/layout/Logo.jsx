import { Link } from "react-router";
import { cn } from "../../lib/utils";

export default function Logo({ className }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="Tune Shed Music — home">
      <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-fg shadow-sm transition-transform group-hover:-rotate-6">
        <span className="logo-mark size-7" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-xl font-semibold tracking-tight">Tune Shed</span>
        <span className="block text-[0.65rem] font-semibold tracking-[0.3em] text-muted uppercase">Music</span>
      </span>
    </Link>
  );
}
