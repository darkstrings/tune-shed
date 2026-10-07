/** Escapes user input so it's matched literally inside a RegExp (prevents ReDoS / regex injection). */
export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
