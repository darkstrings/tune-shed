import { NavLink } from "react-router";
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminNav() {
  return (
    <nav aria-label="Admin" className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-1 rounded-full border border-border bg-surface p-1 shadow-sm">
        {links.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )
              }>
              <Icon className="size-4" aria-hidden="true" /> {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
