"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CrisisTrustResourceVerification = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const verifierRoles = new Set([
    "authority", "operator", "partner-organization", "trained-community-verifier", "community-report", "unknown"
  ]);
  const sourceClasses = new Set([
    "official-record", "operator-confirmation", "partner-confirmation", "direct-observation", "community-report", "unknown"
  ]);
  const availabilityStates = new Set(["available", "limited", "unavailable", "unknown"]);
  const results = new Set(["supports", "contradicts", "inconclusive"]);
  const strongSources = new Set(["official-record", "operator-confirmation", "partner-confirmation"]);

  function nonEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function validateVerification(item) {
    const errors = [];
    if (!item || typeof item !== "object" || Array.isArray(item)) return ["Resource verification must be an object."];
    if (item.record_type !== "resource-verification") errors.push("record_type must be resource-verification.");
    if (item.protocol_version !== "0.4") errors.push("protocol_version must be 0.4.");
    if (!nonEmpty(item.verification_id)) errors.push("verification_id is required.");
    if (!nonEmpty(item.resource_id)) errors.push("resource_id is required.");
    if (!nonEmpty(item.observed_at) || Number.isNaN(Date.parse(item.observed_at))) errors.push("observed_at must be a valid date-time.");
    if (!verifierRoles.has(item.verifier_role)) errors.push("unsupported verifier_role.");
    if (!sourceClasses.has(item.source_class)) errors.push("unsupported source_class.");
    if (!availabilityStates.has(item.availability)) errors.push("unsupported availability.");
    if (!results.has(item.verification_result)) errors.push("unsupported verification_result.");
    if (item.capacity && typeof item.capacity !== "object") errors.push("capacity must be an object when provided.");
    if (item.accessibility && typeof item.accessibility !== "object") errors.push("accessibility must be an object when provided.");
    return errors;
  }

  function ageMinutes(item, now = new Date()) {
    return Math.max(0, (now.getTime() - new Date(item.observed_at).getTime()) / 60000);
  }

  function isFresh(item, now = new Date(), maxAgeMinutes = 120) {
    return ageMinutes(item, now) <= maxAgeMinutes;
  }

  function sortNewest(records) {
    return [...records].sort((a, b) => Date.parse(b.observed_at) - Date.parse(a.observed_at));
  }

  function deriveResourceState(resource, records, options = {}) {
    const now = options.now instanceof Date ? options.now : new Date(options.now || Date.now());
    const maxAgeMinutes = Number.isFinite(options.maxAgeMinutes) ? options.maxAgeMinutes : 120;
    const valid = (records || []).filter((item) => item.resource_id === resource.resource_id && validateVerification(item).length === 0);
    const ordered = sortNewest(valid);

    if (!ordered.length) {
      return { state: "unverified", freshness: "unknown", reason: "No verification records are available.", latest: null, support_count: 0, conflict_count: 0 };
    }

    const fresh = ordered.filter((item) => isFresh(item, now, maxAgeMinutes));
    if (!fresh.length) {
      return { state: "stale", freshness: "stale", reason: "All verification records are older than the freshness window.", latest: ordered[0], support_count: 0, conflict_count: 0 };
    }

    const conflicting = fresh.filter((item) => item.verification_result === "contradicts");
    const supporting = fresh.filter((item) => item.verification_result === "supports");
    const distinctSupportSources = new Set(supporting.map((item) => item.source_class));
    const strongSupport = supporting.some((item) => strongSources.has(item.source_class));
    const strongUnavailable = fresh.some((item) => strongSources.has(item.source_class) && item.availability === "unavailable");
    const availableSupport = supporting.some((item) => item.availability === "available" || item.availability === "limited");

    if (conflicting.length && (supporting.length || conflicting.length > 1)) {
      return {
        state: "conflicting",
        freshness: "current",
        reason: "Current verification records disagree. Conflict remains visible until reconciled.",
        latest: fresh[0],
        support_count: supporting.length,
        conflict_count: conflicting.length
      };
    }

    if (strongUnavailable && !availableSupport) {
      return {
        state: "unavailable",
        freshness: "current",
        reason: "A current strong-source verification reports the resource unavailable.",
        latest: fresh[0],
        support_count: supporting.length,
        conflict_count: conflicting.length
      };
    }

    if (strongSupport || distinctSupportSources.size >= 2) {
      return {
        state: "verified",
        freshness: "current",
        reason: strongSupport
          ? "A current authority/operator/partner source supports this resource state."
          : "Two distinct current source classes support this resource state.",
        latest: fresh[0],
        support_count: supporting.length,
        conflict_count: conflicting.length
      };
    }

    return {
      state: "unverified",
      freshness: "current",
      reason: "Current information exists, but corroboration is insufficient for verified status.",
      latest: fresh[0],
      support_count: supporting.length,
      conflict_count: conflicting.length
    };
  }

  function latestOperationalSnapshot(resource, records, options = {}) {
    const state = deriveResourceState(resource, records, options);
    const relevant = sortNewest((records || []).filter((item) => item.resource_id === resource.resource_id && validateVerification(item).length === 0));
    const latest = state.latest || relevant[0] || null;
    return {
      resource_id: resource.resource_id,
      state: state.state,
      freshness: state.freshness,
      availability: latest ? latest.availability : resource.availability || "unknown",
      capacity: latest && latest.capacity ? latest.capacity : { status: "unknown" },
      accessibility: latest && latest.accessibility ? latest.accessibility : { status: "unknown" },
      last_observed_at: latest ? latest.observed_at : null,
      reason: state.reason,
      support_count: state.support_count,
      conflict_count: state.conflict_count
    };
  }

  return Object.freeze({
    verifierRoles,
    sourceClasses,
    availabilityStates,
    results,
    validateVerification,
    ageMinutes,
    isFresh,
    deriveResourceState,
    latestOperationalSnapshot
  });
});
