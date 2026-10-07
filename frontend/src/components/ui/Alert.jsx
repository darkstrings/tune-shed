import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../../lib/utils";

const styles = {
  info: ["bg-info-soft text-info", Info],
  success: ["bg-ok-soft text-ok", CheckCircle2],
  warning: ["bg-warn-soft text-warn", AlertTriangle],
  error: ["bg-danger-soft text-danger", AlertTriangle],
};

export default function Alert({ tone = "info", className, children }) {
  const [cls, Icon] = styles[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-xl px-4 py-3 text-sm", cls, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
