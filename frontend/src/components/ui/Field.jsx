import { useId, cloneElement, isValidElement } from "react";
import { cn } from "../../lib/utils";

/** Label + control + error/hint. Wires up id/aria attributes on its single child. */
export default function Field({ label, error, hint, className, children }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id: children.props.id ?? id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={children?.props?.id ?? id} className="label">
          {label}
        </label>
      )}
      {control}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
