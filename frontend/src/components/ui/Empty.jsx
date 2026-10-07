import { Guitar } from "lucide-react";

export default function Empty({ title, message, action, icon: Icon = Guitar }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Icon className="size-10 text-subtle" aria-hidden="true" />
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {message && <p className="max-w-sm text-sm text-muted">{message}</p>}
      {action}
    </div>
  );
}
