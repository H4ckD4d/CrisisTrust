"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CrisisTrustAccessibility = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const classMap = Object.freeze({
    highContrast: "access-high-contrast",
    largeText: "access-large-text",
    reducedMotion: "access-reduced-motion",
    lowBandwidth: "access-low-bandwidth"
  });

  function applyPreference(doc, preference, enabled) {
    const className = classMap[preference];
    if (!doc || !className) return false;
    doc.documentElement.classList.toggle(className, Boolean(enabled));
    return Boolean(enabled);
  }

  function attach(doc) {
    if (!doc || typeof doc.getElementById !== "function") return;
    const languageSelect = doc.getElementById("languageSelect");
    const highContrast = doc.getElementById("highContrastToggle");
    const largeText = doc.getElementById("largeTextToggle");
    const reducedMotion = doc.getElementById("reducedMotionToggle");
    const lowBandwidth = doc.getElementById("lowBandwidthToggle");
    const announcer = doc.getElementById("accessibilityStatus");

    function announce() {
      if (!announcer || !root.CrisisTrustI18n) return;
      announcer.textContent = root.CrisisTrustI18n.t("controls.session");
    }

    if (languageSelect && root.CrisisTrustI18n) {
      languageSelect.addEventListener("change", () => {
        root.CrisisTrustI18n.setLanguage(languageSelect.value, doc);
        announce();
      });
    }

    [
      [highContrast, "highContrast"],
      [largeText, "largeText"],
      [reducedMotion, "reducedMotion"],
      [lowBandwidth, "lowBandwidth"]
    ].forEach(([control, preference]) => {
      if (!control) return;
      control.addEventListener("change", () => {
        applyPreference(doc, preference, control.checked);
        announce();
      });
    });

    if (root.CrisisTrustI18n) {
      root.CrisisTrustI18n.applyTranslations(doc);
    }
  }

  return Object.freeze({ classMap, applyPreference, attach });
});

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => CrisisTrustAccessibility.attach(document));
}
