export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-card border border-border bg-surface shadow-card lg:grid-cols-2">
      <div className="relative hidden lg:block" aria-hidden="true">
        <img src="/images/retrofret-gq-12.webp" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <p className="absolute inset-x-0 bottom-0 p-10 font-display text-3xl leading-tight font-semibold text-white">
          “The guitar is a small orchestra.”
          <span className="mt-2 block font-sans text-sm font-normal text-white/70">— Andrés Segovia</span>
        </p>
      </div>
      <div className="p-6 sm:p-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <p className="mt-6 text-sm text-muted">{footer}</p>}
      </div>
    </div>
  );
}
