(() => {
  const body = document.body;

  // ---------------------------------------------------------------------------
  // Theme toggle (persisted)
  // ---------------------------------------------------------------------------
  const THEME_KEY = "portfolio-theme";

  const themeToggleButton = document.querySelector(
    '.btn[aria-label="toggle theme"]'
  );
  const themeIcon = document.getElementById("btn-theme");

  const applyTheme = (theme) => {
    body.classList.remove("light", "dark");
    body.classList.add(theme);

    if (themeIcon) {
      themeIcon.classList.remove("fa-moon", "fa-sun");
      themeIcon.classList.add(theme === "dark" ? "fa-sun" : "fa-moon");
    }
  };

  const getInitialTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "dark" ? "dark" : "light";
  };

  applyTheme(getInitialTheme());

  themeToggleButton?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });

  // ---------------------------------------------------------------------------
  // Sidebar navigation (mobile open/close + close on link click)
  // ---------------------------------------------------------------------------
  const navToggleButton = document.querySelector(".sidebar__nav-toggle");
  const sidebarNav = document.getElementById("sidebar-nav");

  const mobileMql = window.matchMedia("(max-width: 900px)");

  const setNavOpen = (open) => {
    if (!sidebarNav || !navToggleButton) return;

    sidebarNav.classList.toggle("is-open", open);
    navToggleButton.setAttribute("aria-expanded", String(open));
  };

  const syncNavToViewport = () => {
    // Desktop: nav open. Mobile: nav closed until toggled.
    setNavOpen(!mobileMql.matches);
  };

  syncNavToViewport();

  // Prefer MediaQueryList change events; fall back to resize if needed.
  if (typeof mobileMql.addEventListener === "function") {
    mobileMql.addEventListener("change", syncNavToViewport);
  } else {
    window.addEventListener("resize", syncNavToViewport);
  }

  navToggleButton?.addEventListener("click", () => {
    const isOpen = sidebarNav?.classList.contains("is-open") ?? false;
    setNavOpen(!isOpen);
  });

  // Keep anchor scrolling as native behavior; only close the menu on mobile.
  document
    .querySelectorAll('.sidebar__nav-link[href^="#"]')
    .forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileMql.matches) setNavOpen(false);
      });
    });

  // ---------------------------------------------------------------------------
  // Scroll-to-top button
  // ---------------------------------------------------------------------------
  const scrollTopButton = document.querySelector(".scroll-top");

  const updateScrollTopVisibility = () => {
    if (!scrollTopButton) return;
    scrollTopButton.style.display = window.scrollY > 500 ? "inline-flex" : "none";
  };

  window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });
  updateScrollTopVisibility();

  scrollTopButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
