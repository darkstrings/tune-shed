import { useEffect } from "react";

export function useClickOutside(ref, open, onClose) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && onClose();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, onClose]);
}
