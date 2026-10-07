try {
  var t = localStorage.getItem("tuneshed:theme") || "light";
  var dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
} catch (e) {}
