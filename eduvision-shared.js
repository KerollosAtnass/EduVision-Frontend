(() => {
  const APP_KEY = "eduvision-app-state";
  const SESSION_KEY = "eduvision-session";

  const defaultState = {
    theme: "dark",
    lang: "ar",
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getState() {
    return { ...defaultState, ...readJSON(APP_KEY, {}) };
  }

  function setState(patch) {
    const next = { ...getState(), ...patch };
    writeJSON(APP_KEY, next);
    return next;
  }

  function setSession(session) {
    writeJSON(SESSION_KEY, { ...session, loggedAt: Date.now() });
  }

  function getSession() {
    return readJSON(SESSION_KEY, null);
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function roleHome(role) {
    if (role === "admin") return "eduvision-admin-dashboard.html";
    if (role === "professor") return "eduvision-professor-dashboard.html";
    return "eduvision-student-dashboard.html";
  }

  function applyDocumentDirection(lang) {
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "ar");
    document.documentElement.setAttribute("dir", lang === "en" ? "ltr" : "rtl");
    document.body.dir = lang === "en" ? "ltr" : "rtl";
  }

  function applyGlobalState() {
    const state = getState();
    document.documentElement.dataset.theme = state.theme;
    applyDocumentDirection(state.lang);
    return state;
  }

  function requireRole(allowedRoles) {
    const session = getSession();
    if (!session || !allowedRoles.includes(session.role)) {
      window.location.href = "eduvision-register.html";
      return null;
    }
    return session;
  }

  window.EduVisionApp = {
    getState,
    setState,
    setSession,
    getSession,
    clearSession,
    roleHome,
    applyGlobalState,
    requireRole,
  };
})();
