import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

export function PrivateRoute() {
  const user = useSelector((s) => s.auth.userInfo);
  const { pathname } = useLocation();
  return user ? <Outlet /> : <Navigate to={`/login?redirect=${encodeURIComponent(pathname)}`} replace />;
}

export function AdminRoute() {
  const user = useSelector((s) => s.auth.userInfo);
  const { pathname } = useLocation();
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(pathname)}`} replace />;
  return user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
