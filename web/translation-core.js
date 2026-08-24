"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CrisisTrustTranslation = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const translationStatuses = new Set([
    "source-provided",
    "human-reviewed",
    "machine-assisted-unreviewed",
    "translator-declared",
    "unverified"
  ]);
  const translatableFields = new Set(["event", "description", "instruction", "area_description"]);
  const languagePattern = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;

  function nonEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function isLanguageTag(value) {
    return typeof value === "string" && languagePattern.test(value);
  }

  function normalizeLanguage(value) {
    return String(value || "").toLowerCase();
  }

  function validateTranslation(record) {
    const errors = [];
    if (!record || typeof record !== "object" || Array.isArray(record)) return ["Translation record must be an object."];
    if (record.record_type !== "translation-record") errors.push("record_type must be translation-record.");
    if (record.protocol_version !== "0.3") errors.push("protocol_version must be 0.3.");
    if (!nonEmpty(record.translation_id)) errors.push("translation_id is required.");
    if (!nonEmpty(record.subject_id)) errors.push("subject_id is required.");
    if (!translatableFields.has(record.field)) errors.push("unsupported translation field.");
    if (!isLanguageTag(record.source_language)) errors.push("source_language must be a well-formed BCP 47 style tag.");
    if (!isLanguageTag(record.target_language)) errors.push("target_language must be a well-formed BCP 47 style tag.");
    if (normalizeLanguage(record.source_language) === normalizeLanguage(record.target_language)) {
      errors.push("source_language and target_language must differ.");
    }
    if (!nonEmpty(record.source_text)) errors.push("source_text is required.");
    if (!nonEmpty(record.translated_text)) errors.push("translated_text is required.");
    if (!translationStatuses.has(record.translation_status)) errors.push("unsupported translation_status.");
    if (record.translator_reference !== undefined && !nonEmpty(record.translator_reference)) {
      errors.push("translator_reference must be non-empty when present.");
    }
    return errors;
  }

  function matchesSource(sourceRecord, translationRecord) {
    if (!sourceRecord || typeof sourceRecord !== "object") return false;
    if (!translationRecord || typeof translationRecord !== "object") return false;
    if (sourceRecord.alert_id !== translationRecord.subject_id) return false;
    if (!translatableFields.has(translationRecord.field)) return false;
    if (sourceRecord[translationRecord.field] !== translationRecord.source_text) return false;
    if (sourceRecord.language && normalizeLanguage(sourceRecord.language) !== normalizeLanguage(translationRecord.source_language)) return false;
    return true;
  }

  function buildCompanion(sourceRecord, translationRecord) {
    const errors = validateTranslation(translationRecord);
    if (errors.length) throw new Error(errors.join(" "));
    if (!matchesSource(sourceRecord, translationRecord)) {
      throw new Error("Translation does not exactly match the source record.");
    }
    return Object.freeze({
      subject_id: translationRecord.subject_id,
      field: translationRecord.field,
      source_language: translationRecord.source_language,
      target_language: translationRecord.target_language,
      source_text: translationRecord.source_text,
      translated_text: translationRecord.translated_text,
      translation_status: translationRecord.translation_status,
      translator_reference: translationRecord.translator_reference || "not-declared"
    });
  }

  function statusLabel(status) {
    return {
      "source-provided": "source-provided",
      "human-reviewed": "human-reviewed",
      "machine-assisted-unreviewed": "machine-assisted / unreviewed",
      "translator-declared": "translator-declared",
      unverified: "unverified"
    }[status] || "unknown";
  }

  return Object.freeze({
    translationStatuses,
    translatableFields,
    isLanguageTag,
    validateTranslation,
    matchesSource,
    buildCompanion,
    statusLabel
  });
});
