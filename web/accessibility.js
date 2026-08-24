"use strict";

(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CrisisTrustAccessibility = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  const classMap = Object.freeze({
    highContrast: "access-high-contrast",
    largeText: "access-large-text",
    reducedMotion: "access-reduced-motion",
    lowBandwidth: "access-low-bandwidth",
    simpleLanguage: "access-simple-language"
  });

  const simpleLanguageText = Object.freeze({
    en: "Check the source. Read the original instruction. If a personal request is urgent, verify it through a different trusted channel before acting. A translation helps you understand the message, but the original source text stays visible.",
    "pt-BR": "Confira a fonte. Leia a instrução original. Se um pedido pessoal for urgente, confirme por outro canal confiável antes de agir. A tradução ajuda a entender a mensagem, mas o texto original da fonte continua visível.",
    es: "Revise la fuente. Lea la instrucción original. Si una solicitud personal es urgente, confírmela por otro canal confiable antes de actuar. La traducción ayuda a entender el mensaje, pero el texto original de la fuente permanece visible."
  });

  const simpleLanguageLabels = Object.freeze({
    en: { control: "Simple-language companion", heading: "Plain-language companion" },
    "pt-BR": { control: "Explicação em linguagem simples", heading: "Explicação em linguagem simples" },
    es: { control: "Explicación en lenguaje claro", heading: "Explicación en lenguaje claro" }
  });

  function applyPreference(doc, preference, enabled) {
    const className = classMap[preference];
    if (!doc || !className) return false;
    doc.documentElement.classList.toggle(className, Boolean(enabled));
    return Boolean(enabled);
  }

  function updateSimpleLanguage(doc, enabled) {
    const panel = doc?.getElementById("simpleLanguageCompanion");
    const text = doc?.getElementById("simpleLanguageText");
    const label = doc?.getElementById("simpleLanguageLabel");
    const heading = doc?.getElementById("simpleLanguageHeading");
    if (!panel || !text) return;
    const language = root.CrisisTrustI18n ? root.CrisisTrustI18n.currentLanguage() : "en";
    const labels = simpleLanguageLabels[language] || simpleLanguageLabels.en;
    panel.hidden = !enabled;
    text.lang = language;
    text.textContent = simpleLanguageText[language] || simpleLanguageText.en;
    if (label) label.textContent = labels.control;
    if (heading) heading.textContent = labels.heading;
  }

  function attach(doc) {
    if (!doc || typeof doc.getElementById !== "function") return;
    const languageSelect = doc.getElementById("languageSelect");
    const highContrast = doc.getElementById("highContrastToggle");
    const largeText = doc.getElementById("largeTextToggle");
    const reducedMotion = doc.getElementById("reducedMotionToggle");
    const lowBandwidth = doc.getElementById("lowBandwidthToggle");
    const simpleLanguage = doc.getElementById("simpleLanguageToggle");
    const announcer = doc.getElementById("accessibilityStatus");

    function announce() {
      if (!announcer || !root.CrisisTrustI18n) return;
      announcer.textContent = root.CrisisTrustI18n.t("controls.session");
    }

    if (languageSelect && root.CrisisTrustI18n) {
      languageSelect.addEventListener("change", () => {
        root.CrisisTrustI18n.setLanguage(languageSelect.value, doc);
        updateSimpleLanguage(doc, Boolean(simpleLanguage?.checked));
        announce();
      });
    }

    [
      [highContrast, "highContrast"],
      [largeText, "largeText"],
      [reducedMotion, "reducedMotion"],
      [lowBandwidth, "lowBandwidth"],
      [simpleLanguage, "simpleLanguage"]
    ].forEach(([control, preference]) => {
      if (!control) return;
      control.addEventListener("change", () => {
        applyPreference(doc, preference, control.checked);
        if (preference === "simpleLanguage") updateSimpleLanguage(doc, control.checked);
        announce();
      });
    });

    if (root.CrisisTrustI18n) root.CrisisTrustI18n.applyTranslations(doc);
    updateSimpleLanguage(doc, Boolean(simpleLanguage?.checked));
  }

  return Object.freeze({ classMap, simpleLanguageText, simpleLanguageLabels, applyPreference, updateSimpleLanguage, attach });
});

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => CrisisTrustAccessibility.attach(document));
}
