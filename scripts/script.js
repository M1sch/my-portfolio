const body = document.body;

const themeToggleButton = document.querySelector(
  '.btn[aria-label="toggle theme"]'
);
const themeIcon = document.getElementById("btn-theme");

const navToggleButton = document.querySelector(".sidebar__nav-toggle");
const sidebarNav = document.getElementById("sidebar-nav");

const scrollTopButton = document.querySelector(".scroll-top");

const THEME_KEY = "portfolio-theme";

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

const setNavOpen = (open) => {
  if (!sidebarNav || !navToggleButton) return;

  sidebarNav.classList.toggle("is-open", open);
  navToggleButton.setAttribute("aria-expanded", String(open));
};

const initNavState = () => {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  setNavOpen(!isMobile);
};

initNavState();
window.addEventListener("resize", initNavState);

navToggleButton?.addEventListener("click", () => {
  const isOpen = sidebarNav?.classList.contains("is-open") ?? false;
  setNavOpen(!isOpen);
});

const navLinks = Array.from(
  document.querySelectorAll('.sidebar__nav-link[href^="#"]')
);
const sectionMap = new Map();

navLinks.forEach((link) => {
  const id = link.getAttribute("href")?.slice(1);
  if (!id) return;

  const section = document.getElementById(id);
  if (section) sectionMap.set(section, link);
});

const setActiveLink = (activeLink) => {
  navLinks.forEach((link) => link.classList.remove("is-active"));
  if (activeLink) activeLink.classList.add("is-active");
};

document.querySelectorAll(".sidebar__nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    setActiveLink(link);

    if (window.matchMedia("(max-width: 900px)").matches) {
      setNavOpen(false);
    }
  });
});

const sections = Array.from(sectionMap.keys()).sort(
  (a, b) => a.offsetTop - b.offsetTop
);

const updateActiveFromScroll = () => {
  if (sections.length === 0) return;

  const doc = document.documentElement;
  const scrollBottom = window.scrollY + window.innerHeight;
  const docHeight = doc.scrollHeight;

  // Ensure the last section becomes active even if it's too short to cross the marker.
  if (scrollBottom >= docHeight - 2) {
    setActiveLink(sectionMap.get(sections[sections.length - 1]));
    return;
  }

  const marker = window.scrollY + window.innerHeight * 0.45;

  let current = sections[0];
  for (const section of sections) {
    if (section.offsetTop <= marker) current = section;
  }

  setActiveLink(sectionMap.get(current));
};

let activeRafId = null;
const requestActiveUpdate = () => {
  if (activeRafId !== null) return;

  activeRafId = window.requestAnimationFrame(() => {
    activeRafId = null;
    updateActiveFromScroll();
  });
};

window.addEventListener("scroll", requestActiveUpdate, { passive: true });
window.addEventListener("resize", requestActiveUpdate);
requestActiveUpdate();

const updateScrollTopVisibility = () => {
  if (!scrollTopButton) return;
  const shouldShow = window.scrollY > 500;
  scrollTopButton.style.display = shouldShow ? "inline-flex" : "none";
};

document.addEventListener("scroll", updateScrollTopVisibility, {
  passive: true,
});
updateScrollTopVisibility();

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
