(() => {
  const body = document.body;

  // ---------------------------------------------------------------------------
  // Theme toggle (persisted)
  // ---------------------------------------------------------------------------
  const THEME_KEY = "portfolio-theme";

  const themeToggleButton = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const updateThemeIcon = (isDark) => {
    if (!themeIcon) return;
    themeIcon.classList.toggle("icon--moon", !isDark);
    themeIcon.classList.toggle("icon--sun", isDark);
  };

  const applyTheme = (theme) => {
    body.classList.remove("light", "dark");
    body.classList.add(theme);
    updateThemeIcon(theme === "dark");
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
  // Language switch (persisted + data-i18n)
  // ---------------------------------------------------------------------------
  const LANG_KEY = "portfolio-lang";

  const TRANSLATIONS = {
    en: {
      ui: {
        skip: "Skip to content",
        menu: "menu",
        emailMe: "Email me",
      },
      nav: {
        about: "About",
        projects: "Projects",
        skills: "Skills",
        contact: "Contact",
      },
      section: {
        about: "About",
        projects: "Projects",
        skills: "Skills",
        contact: "Contact",
      },
      sidebar: {
        role: "IT - System Engineer",
        tagline: "Home-labs • Coding • Security",
      },
      about: {
        // Using HTML because your paragraph uses <br> and <b>
        desc:
          "I am an mostly autodidact tech enthusiast and a curious systems engineer. " +
          "At work I tinker with servers, clients and networks — at home with old boards " +
          "and my soldering iron, microcontrollers, test- & home-labs and code. " +
          "I'm learning to turn that curiosity into professional cybersecurity skills." +
          "<br /><br />" +
          "Just <b>coding</b> for fun and <b>to get better every day</b>. " +
          "I'm practical, curious and enjoy diving into technical topics." +
          "<br /><br />" +
          "I'm actively transitioning from general system engineering towards detection engineering " +
          "and threat hunting — Learning CyberSecurity hands-on through home-labs, private projects and online courses.",
      },
      skills: {
        admin: "Administration & Troubleshooting",
        coding: "Coding",
      },
      contact: {
        desc:
          "If you want to chat about systems, security or a potential collaboration, feel free to reach out",
      },
      footer: {
        createdBy: "Created By Michael Seifert",
      },
    },
    de: {
      ui: {
        skip: "Zum Inhalt springen",
        menu: "Menü",
        emailMe: "E-Mail",
      },
      nav: {
        about: "Über mich",
        projects: "Projekte",
        skills: "Skills",
        contact: "Kontakt",
      },
      section: {
        about: "Über mich",
        projects: "Projekte",
        skills: "Skills",
        contact: "Kontakt",
      },
      sidebar: {
        role: "IT - System Engineer",
        tagline: "Home-Labs • Coding • Security",
      },
      about: {
        desc:
          "Ich bin ein überwiegend autodidaktischer Technik-Enthusiast und ein neugieriger System Engineer. " +
          "Beruflich arbeite ich an Servern, Clients und Netzwerken - privat schraube ich an alten Boards, " +
          "mit dem Lötkolben, an Mikrocontrollern, in Test- & Home-Labs und natürlich an Code. " +
          "Gerade baue ich diese Neugier Schritt für Schritt zu professionellen Cybersecurity-Skills aus." +
          "<br /><br />" +
          "Ich <b>code</b> aus Spaß - und um <b>jeden Tag besser zu werden</b>. " +
          "Ich bin praktisch veranlagt, neugierig und tauche gern tief in technische Themen ein." +
          "<br /><br />" +
          "Aktuell bewege ich mich vom klassischen System Engineering Richtung Detection Engineering und Threat Hunting - " +
          "CyberSecurity lerne ich hands-on durch Home-Labs, private Projekte und Online-Kurse.",
      },
      skills: {
        admin: "Administration & Fehlerbehebung",
        coding: "Coding",
      },
      contact: {
        desc:
          "Wenn Sie über Systeme, Security oder eine mögliche Zusammenarbeit sprechen möchten, schreiben Sie mir gerne",
      },
      footer: {
        createdBy: "Erstellt von Michael Seifert",
      },
    },
  };

  const getInitialLanguage = () => {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "de" || stored === "en") return stored;

    // navigator.language is usually like "de-DE", "en-US", ...
    const browserLang = (navigator.language || "en").toLowerCase();
    return browserLang.startsWith("de") ? "de" : "en";
  };

  const setActiveLangButtons = (lang) => {
    document.querySelectorAll(".lang-switch__btn[data-lang]").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  };

  const applyTranslations = (lang) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // Set <html lang="..."> for accessibility / correct language handling
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;

      const value = key.split(".").reduce((acc, part) => acc?.[part], dict);
      if (typeof value !== "string") return;

      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    setActiveLangButtons(lang);
  };

  let currentLang = getInitialLanguage();
  applyTranslations(currentLang);

  document.querySelectorAll(".lang-switch__btn[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextLang = btn.getAttribute("data-lang");
      if (!nextLang || nextLang === currentLang) return;

      currentLang = nextLang;
      localStorage.setItem(LANG_KEY, currentLang);
      applyTranslations(currentLang);
    });
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

  if (typeof mobileMql.addEventListener === "function") {
    mobileMql.addEventListener("change", syncNavToViewport);
  } else {
    window.addEventListener("resize", syncNavToViewport);
  }

  navToggleButton?.addEventListener("click", () => {
    const isOpen = sidebarNav?.classList.contains("is-open") ?? false;
    setNavOpen(!isOpen);
  });

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
