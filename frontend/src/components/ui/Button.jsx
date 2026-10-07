import { cn } from "../../lib/utils";
import Spinner from "./Spinner";

const variants = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent-hover shadow-[0_8px_24px_-12px_var(--accent)] border border-transparent",
  secondary: "bg-surface text-fg border border-border hover:bg-surface-2 hover:border-border-strong",
  ghost: "text-muted hover:text-fg hover:bg-surface-2 border border-transparent",
  danger: "bg-danger text-white hover:opacity-90 border border-transparent",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-9 w-9 justify-center",
};

/** Polymorphic button: pass `as={Link}` to render a router link with button styles. */
export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) {
  const isButton = Comp === "button";
  return (
    <Comp
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-all duration-150",
        "active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={isButton ? disabled || loading : undefined}
      {...(isButton && !props.type ? { type: "button" } : {})}
      {...props}>
      {loading && <Spinner className="size-4" />}
      {children}
    </Comp>
  );
}
