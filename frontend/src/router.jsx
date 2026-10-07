import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import { PrivateRoute, AdminRoute } from "./components/layout/Guards";
import { PageSpinner } from "./components/ui/Spinner";
import Home from "./pages/Home";

const page = (load) => async () => ({ Component: (await load()).default });

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    hydrateFallbackElement: <PageSpinner />,
    children: [
      { index: true, element: <Home /> },
      { path: "product/:id", lazy: page(() => import("./pages/Product")) },
      { path: "cart", lazy: page(() => import("./pages/Cart")) },
      { path: "login", lazy: page(() => import("./pages/Login")) },
      { path: "register", lazy: page(() => import("./pages/Register")) },
      {
        element: <PrivateRoute />,
        children: [
          { path: "shipping", lazy: page(() => import("./pages/Shipping")) },
          { path: "payment", lazy: page(() => import("./pages/Payment")) },
          { path: "placeorder", lazy: page(() => import("./pages/PlaceOrder")) },
          { path: "order/:id", lazy: page(() => import("./pages/Order")) },
          { path: "profile", lazy: page(() => import("./pages/Profile")) },
        ],
      },
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          { index: true, lazy: page(() => import("./pages/admin/Dashboard")) },
          { path: "products", lazy: page(() => import("./pages/admin/Products")) },
          { path: "product/:id/edit", lazy: page(() => import("./pages/admin/ProductEdit")) },
          { path: "orders", lazy: page(() => import("./pages/admin/Orders")) },
          { path: "users", lazy: page(() => import("./pages/admin/Users")) },
          { path: "user/:id/edit", lazy: page(() => import("./pages/admin/UserEdit")) },
        ],
      },
      { path: "*", lazy: page(() => import("./pages/NotFound")) },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
