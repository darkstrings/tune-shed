import { cn } from "../../lib/utils";

const tones = {
  green: "bg-ok-soft text-ok",
  yellow: "bg-warn-soft text-warn",
  red: "bg-danger-soft text-danger",
  blue: "bg-info-soft text-info",
  accent: "bg-accent-soft text-accent",
  solid: "bg-accent text-accent-fg",
  neutral: "bg-surface-2 text-muted",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}>
      {children}
    </span>
  );
}

const conditionTone = { New: "green", "Like New": "blue", Good: "neutral", Fair: "yellow", "As Is": "red" };

export function ConditionBadge({ condition, className }) {
  return (
    <Badge tone={conditionTone[condition] ?? "neutral"} className={className}>
      {condition}
    </Badge>
  );
}
