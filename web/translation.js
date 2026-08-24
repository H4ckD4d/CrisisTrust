"use strict";

const translationFile = document.getElementById("translationFile");
const translationDemoPt = document.getElementById("translationDemoPt");
const translationDemoEs = document.getElementById("translationDemoEs");
const translationStatus = document.getElementById("translationStatus");
const translationView = document.getElementById("translationView");
let activeTranslation = null;

const syntheticTranslations = Object.freeze({
  "pt-BR": Object.freeze({
    record_type: "translation-record",
    protocol_version: "0.3",
    translation_id: "CT-TRANS-DEMO-PTBR-001",
    subject_id: "CT-ALERT-DEMO-0001",
    field: "instruction",
    source_language: "en",
    target_language: "pt-BR",
    source_text: "Follow the instructions of your local emergency authority. This sentence is synthetic test content and is not real-world emergency guidance.",
    translated_text: "Siga as instruções da autoridade de emergência local. Esta frase é conteúdo sintético de teste e não é orientação real para emergências.",
    translation_status: "human-reviewed",
    translator_reference: "CrisisTrust synthetic fixture"
  }),
  es: Object.freeze({
    record_type: "translation-record",
    protocol_version: "0.3",
    translation_id: "CT-TRANS-DEMO-ES-001",
    subject_id: "CT-ALERT-DEMO-0001",
    field: "instruction",
    source_language: "en",
    target_language: "es",
    source_text: "Follow the instructions of your local emergency authority. This sentence is synthetic test content and is not real-world emergency guidance.",
    translated_text: "Siga las instrucciones de su autoridad local de emergencias. Esta frase es contenido sintético de prueba y no constituye orientación real para emergencias.",
    translation_status: "human-reviewed",
    translator_reference: "CrisisTrust synthetic fixture"
  })
});

function translateText(key, fallback) {
  return window.CrisisTrustI18n ? CrisisTrustI18n.t(key, fallback) : fallback;
}

function setTranslationStatus(message, kind = "") {
  translationStatus.textContent = message;
  translationStatus.className = `translation-status ${kind}`.trim();
}

function renderTranslation() {
  translationView.textContent = "";
  if (!activeTranslation || !activeAlert) {
    translationView.className = "empty-state";
    translationView.textContent = translateText("translation.none", "No companion translation loaded.");
    return;
  }

  let companion;
  try {
    companion = CrisisTrustTranslation.buildCompanion(activeAlert, activeTranslation);
  } catch (_error) {
    translationView.className = "empty-state";
    translationView.textContent = translateText("translation.mismatch", "Translation rejected because it does not exactly match the loaded source record.");
    return;
  }

  translationView.className = "translation-grid";
  const original = document.createElement("article");
  original.className = "translation-block";
  const originalHeading = document.createElement("h3");
  const originalTitle = document.createElement("span");
  originalTitle.textContent = translateText("translation.original", "Original");
  const sourceLanguage = document.createElement("span");
  sourceLanguage.className = "tag";
  sourceLanguage.textContent = companion.source_language;
  originalHeading.append(originalTitle, sourceLanguage);
  const originalText = document.createElement("div");
  originalText.className = "translation-text";
  originalText.lang = companion.source_language;
  originalText.textContent = companion.source_text;
  original.append(originalHeading, originalText);

  const translated = document.createElement("article");
  translated.className = "translation-block";
  const translatedHeading = document.createElement("h3");
  const translatedTitle = document.createElement("span");
  translatedTitle.textContent = translateText("translation.companion", "Companion translation");
  const targetLanguage = document.createElement("span");
  targetLanguage.className = "tag";
  targetLanguage.textContent = companion.target_language;
  translatedHeading.append(translatedTitle, targetLanguage);
  const translatedText = document.createElement("div");
  translatedText.className = "translation-text";
  translatedText.lang = companion.target_language;
  translatedText.textContent = companion.translated_text;
  const status = document.createElement("p");
  status.className = "muted";
  status.textContent = `${translateText("translation.status", "Translation status")}: ${CrisisTrustTranslation.statusLabel(companion.translation_status)} · ${companion.translator_reference}`;
  translated.append(translatedHeading, translatedText, status);
  translationView.append(original, translated);
}

function loadTranslation(record) {
  if (!activeAlert) {
    setTranslationStatus(translateText("translation.noAlert", "Load the matching source alert before loading a translation."), "error");
    return false;
  }
  const errors = CrisisTrustTranslation.validateTranslation(record);
  if (errors.length || !CrisisTrustTranslation.matchesSource(activeAlert, record)) {
    setTranslationStatus(translateText("translation.mismatch", "Translation rejected because it does not exactly match the loaded source record."), "error");
    return false;
  }
  activeTranslation = structuredClone(record);
  renderTranslation();
  setTranslationStatus(translateText("translation.loaded", "Companion translation validated locally."), "success");
  return true;
}

translationFile.addEventListener("change", async () => {
  const [file] = translationFile.files;
  if (!file) return;
  try {
    loadTranslation(JSON.parse(await file.text()));
  } catch (_error) {
    setTranslationStatus(translateText("translation.parseError", "Translation file could not be parsed as JSON."), "error");
  }
});

translationDemoPt.addEventListener("click", () => loadTranslation(syntheticTranslations["pt-BR"]));
translationDemoEs.addEventListener("click", () => loadTranslation(syntheticTranslations.es));

document.addEventListener("crisistrust-languagechange", () => renderTranslation());
document.addEventListener("crisistrust-alertchange", () => {
  if (activeTranslation && !CrisisTrustTranslation.matchesSource(activeAlert, activeTranslation)) {
    setTranslationStatus(translateText("translation.mismatch", "Translation rejected because it does not exactly match the loaded source record."), "error");
  }
  renderTranslation();
});
renderTranslation();
