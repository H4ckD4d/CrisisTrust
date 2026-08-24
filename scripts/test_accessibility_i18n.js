"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const i18n = require("../web/i18n.js");
const translation = require("../web/translation-core.js");
const accessibility = require("../web/accessibility.js");

const root = path.resolve(__dirname, "..");
const alert = JSON.parse(fs.readFileSync(path.join(root, "examples/alert.synthetic.json"), "utf8"));
const pt = JSON.parse(fs.readFileSync(path.join(root, "examples/translation.pt-BR.synthetic.json"), "utf8"));
const es = JSON.parse(fs.readFileSync(path.join(root, "examples/translation.es.synthetic.json"), "utf8"));

assert.deepStrictEqual(Object.keys(i18n.dictionaries).sort(), ["en", "es", "pt-BR"].sort());

const englishKeys = Object.keys(i18n.dictionaries.en).sort();
for (const language of ["pt-BR", "es"]) {
  assert.deepStrictEqual(Object.keys(i18n.dictionaries[language]).sort(), englishKeys, `${language} dictionary must contain the same interface keys as English`);
}

assert.strictEqual(i18n.normalizeLanguage("pt-PT"), "pt-BR");
assert.strictEqual(i18n.normalizeLanguage("es-MX"), "es");
assert.strictEqual(i18n.normalizeLanguage("xx"), "en");

for (const tag of ["en", "pt-BR", "es", "fr-CA", "zh-Hant"]) {
  assert.strictEqual(translation.isLanguageTag(tag), true, `${tag} should be accepted as well-formed`);
}
for (const tag of ["", "en_US", "x-", "123"]) {
  assert.strictEqual(translation.isLanguageTag(tag), false, `${tag} should be rejected`);
}

for (const record of [pt, es]) {
  assert.deepStrictEqual(translation.validateTranslation(record), []);
  assert.strictEqual(translation.matchesSource(alert, record), true);
  const companion = translation.buildCompanion(alert, record);
  assert.strictEqual(companion.source_text, alert.instruction);
  assert.notStrictEqual(companion.translated_text, alert.instruction);
}

const mismatched = { ...pt, source_text: "Different source instruction" };
assert.strictEqual(translation.matchesSource(alert, mismatched), false);
assert.throws(() => translation.buildCompanion(alert, mismatched), /does not exactly match/);

const unreviewed = { ...pt, translation_id: "CT-TRANS-TEST-UNREVIEWED", translation_status: "machine-assisted-unreviewed" };
assert.deepStrictEqual(translation.validateTranslation(unreviewed), []);
assert.strictEqual(translation.statusLabel(unreviewed.translation_status), "machine-assisted / unreviewed");

assert.deepStrictEqual(
  Object.keys(accessibility.classMap).sort(),
  ["highContrast", "largeText", "lowBandwidth", "reducedMotion", "simpleLanguage"].sort()
);
assert.ok(accessibility.simpleLanguageText.en.includes("original"));
assert.ok(accessibility.simpleLanguageText["pt-BR"].includes("original"));
assert.ok(accessibility.simpleLanguageText.es.includes("original"));

const html = fs.readFileSync(path.join(root, "web/index.html"), "utf8");
for (const required of [
  'id="languageSelect"',
  'id="highContrastToggle"',
  'id="largeTextToggle"',
  'id="reducedMotionToggle"',
  'id="lowBandwidthToggle"',
  'id="simpleLanguageToggle"',
  'id="simpleLanguageCompanion"',
  'id="translationView"',
  'aria-live="polite"',
  'data-i18n='
]) {
  assert.ok(html.includes(required), `index.html must include ${required}`);
}

const accessibilityCss = fs.readFileSync(path.join(root, "web/accessibility.css"), "utf8");
for (const required of [":focus-visible", "prefers-reduced-motion", "access-high-contrast", "access-large-text", "access-low-bandwidth"]) {
  assert.ok(accessibilityCss.includes(required), `accessibility.css must include ${required}`);
}

console.log("CrisisTrust accessibility, i18n, and translation tests passed.");
