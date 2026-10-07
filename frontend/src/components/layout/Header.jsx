import { useCallback, useRef, useState } from "react";
import { Link, NavLink, useLocation, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  Users,
  X,
} from "lucide-react";
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";
import { selectCartCount } from "../../store/cartSlice";
import { useSignOut } from "../../hooks/useSignOut";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../lib/utils";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
];

function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, open, close);
  const signOut = useSignOut();

  const item = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface-2";
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-border py-1 pr-2 pl-1 text-sm font-medium transition-colors hover:bg-surface-2">
        <span className="grid size-7 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
          {user.name[0]?.toUpperCase()}
        </span>
        <span className="max-w-28 truncate">{user.name.split(" ")[0]}</span>
        <ChevronDown className="size-4 text-muted" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-56 animate-fade-up rounded-xl border border-border bg-surface p-1.5 shadow-xl">
          <p className="truncate px-3 pt-1.5 pb-2 text-xs text-muted">{user.email}</p>
          <Link role="menuitem" to="/profile" className={item} onClick={close}>
            <User className="size-4 text-muted" /> Profile &amp; orders
          </Link>
          {user.isAdmin && (
            <>
              <p className="mt-1 border-t border-border px-3 pt-2 pb-1 text-[0.65rem] font-bold tracking-widest text-subtle uppercase">
                Admin
              </p>
              {adminLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} role="menuitem" to={to} className={item} onClick={close}>
                  <Icon className="size-4 text-muted" /> {label}
                </Link>
              ))}
            </>
          )}
          <button role="menuitem" type="button" className={cn(item, "mt-1 border-t border-border text-danger")} onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function CartLink() {
  const count = useSelector(selectCartCount);
  return (
    <Link
      to="/cart"
      className="relative rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.65rem] leading-5 font-bold text-accent-fg">
          {count}
        </span>
      )}
    </Link>
  );
}

function MobileMenu({ user, onClose }) {
  const signOut = useSignOut();
  const link = ({ isActive }) =>
    cn("flex items-center gap-3 rounded-xl px-4 py-3 font-medium", isActive ? "bg-accent-soft text-accent" : "hover:bg-surface-2");
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-80 max-w-[88vw] animate-fade-up flex-col gap-4 overflow-y-auto bg-surface p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <Logo />
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-surface-2" aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>
        <SearchBox onSearched={onClose} />
        <nav className="flex flex-col gap-1" onClick={onClose}>
          <NavLink to="/" end className={link}>
            <ShoppingBag className="size-5" /> Shop
          </NavLink>
          <NavLink to="/cart" className={link}>
            <ShoppingCart className="size-5" /> Cart
          </NavLink>
          {user ? (
            <NavLink to="/profile" className={link}>
              <User className="size-5" /> Profile &amp; orders
            </NavLink>
          ) : (
            <NavLink to="/login" className={link}>
              <User className="size-5" /> Sign in
            </NavLink>
          )}
          {user?.isAdmin && (
            <>
              <p className="mt-3 px-4 text-[0.65rem] font-bold tracking-widest text-subtle uppercase">Admin</p>
              {adminLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={link}>
                  <Icon className="size-5" /> {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <ThemeToggle />
          {user && (
            <button type="button" onClick={signOut} className="flex items-center gap-2 text-sm font-medium text-danger">
              <LogOut className="size-4" /> Sign out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const user = useSelector((s) => s.auth.userInfo);
  const [menuOpen, setMenuOpen] = useState(false);
  const [params] = useSearchParams();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-xl">
      {user?.isDemo && (
        <p className="bg-fg py-1.5 text-center text-xs font-medium text-bg">
          You're using a read-only demo account — look around freely, nothing you do will change the store.
        </p>
      )}
      <div className="container-x flex h-16 items-center gap-4">
        <Logo />
        <SearchBox key={params.get("q") ?? ""} className="mx-auto hidden w-full max-w-md lg:block" />
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <CartLink />
          <div className="ml-2 hidden lg:block">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                to={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-85">
                Sign in
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-fg lg:hidden"
            aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
      {menuOpen && <MobileMenu user={user} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
