import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { Toaster } from "sonner";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const { isDark } = useTheme();
  const { pathname, hash } = useLocation();

  // Jump to in-page anchors like /#shop after navigation.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash, pathname]);

  return (
    <>
      <a
        href="#main"
        className="absolute -top-20 left-4 z-50 rounded-lg bg-accent px-4 py-2 font-semibold text-accent-fg focus:top-4">
        Skip to content
      </a>
      <Header />
      <main id="main" className="container-x min-h-[70vh] py-8 sm:py-10">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" theme={isDark ? "dark" : "light"} richColors closeButton />
      <ScrollRestoration />
    </>
  );
}
