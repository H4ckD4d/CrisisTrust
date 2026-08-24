"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CrisisTrustTrustCheck = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const claimTypes = new Set(["family-emergency", "urgent-financial-request", "account-security-warning", "other"]);
  const requestedActions = new Set(["none", "call-back", "transfer-money", "share-secret", "travel", "other"]);
  const verificationStates = new Set(["unreviewed", "verifying", "verified-by-process", "unresolved", "conflicting", "cancelled"]);
  const channelTypes = new Set(["known-phone", "known-messaging", "known-email", "in-person", "official-channel", "other"]);
  const channelResults = new Set(["confirmed", "denied", "no-response", "not-checked"]);
  const challengeResults = new Set(["passed", "failed", "not-used"]);
  const circleResults = new Set(["confirmed", "denied", "unavailable", "not-asked"]);

  function nonEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function validateCase(item) {
    const errors = [];
    if (!item || typeof item !== "object" || Array.isArray(item)) return ["TrustCheck case must be an object."];
    if (item.record_type !== "trustcheck-case") errors.push("record_type must be trustcheck-case.");
    if (item.protocol_version !== "0.2") errors.push("protocol_version must be 0.2.");
    if (!nonEmpty(item.case_id)) errors.push("case_id is required.");
    if (!claimTypes.has(item.claim_type)) errors.push("unsupported claim_type.");
    if (!nonEmpty(item.received_at)) errors.push("received_at is required.");
    if (!requestedActions.has(item.requested_action)) errors.push("unsupported requested_action.");
    if (!verificationStates.has(item.verification_state)) errors.push("unsupported verification_state.");
    if (!Array.isArray(item.channels)) errors.push("channels must be an array.");
    if (!item.challenge || typeof item.challenge !== "object") errors.push("challenge is required.");
    if (!Array.isArray(item.trusted_circle)) errors.push("trusted_circle must be an array.");

    for (const channel of item.channels || []) {
      if (!nonEmpty(channel.channel_id)) errors.push("channel_id is required.");
      if (!channelTypes.has(channel.channel_type)) errors.push("unsupported channel_type.");
      if (typeof channel.independently_initiated !== "boolean") errors.push("independently_initiated must be boolean.");
      if (!channelResults.has(channel.result)) errors.push("unsupported channel result.");
    }

    if (item.challenge && typeof item.challenge === "object") {
      if (typeof item.challenge.was_prearranged !== "boolean") errors.push("challenge.was_prearranged must be boolean.");
      if (!challengeResults.has(item.challenge.result)) errors.push("unsupported challenge result.");
      if (item.challenge.result === "passed" && item.challenge.was_prearranged !== true) {
        errors.push("a passed challenge only counts when it was prearranged.");
      }
    }

    for (const person of item.trusted_circle || []) {
      if (!nonEmpty(person.alias)) errors.push("trusted-circle alias is required.");
      if (!circleResults.has(person.result)) errors.push("unsupported trusted-circle result.");
    }

    return errors;
  }

  function evaluateCase(item) {
    const errors = validateCase(item);
    if (errors.length) throw new Error(errors.join(" "));
    if (item.verification_state === "cancelled") {
      return { state: "cancelled", reason: "Verification was cancelled by the user." };
    }

    const independentChannels = item.channels.filter((channel) => channel.independently_initiated === true);
    const independentConfirmed = independentChannels.some((channel) => channel.result === "confirmed");
    const independentDenied = independentChannels.some((channel) => channel.result === "denied");
    const challengePassed = item.challenge.was_prearranged === true && item.challenge.result === "passed";
    const challengeFailed = item.challenge.was_prearranged === true && item.challenge.result === "failed";
    const circleConfirmed = item.trusted_circle.some((person) => person.result === "confirmed");
    const circleDenied = item.trusted_circle.some((person) => person.result === "denied");

    if (independentDenied || challengeFailed || circleDenied) {
      return {
        state: "conflicting",
        reason: "At least one independent verification result contradicts the claim."
      };
    }

    if (independentConfirmed && (challengePassed || circleConfirmed)) {
      return {
        state: "verified-by-process",
        reason: "Independent confirmation plus a second trusted corroboration completed the TrustCheck process."
      };
    }

    return {
      state: "unresolved",
      reason: independentConfirmed
        ? "Independent confirmation exists, but a second trusted corroboration is still missing."
        : "No independently initiated channel has confirmed the claim."
    };
  }

  function consequenceLabel(action) {
    return {
      none: "No high-consequence action declared",
      "call-back": "Call-back requested",
      "transfer-money": "Money transfer requested — verify independently before acting",
      "share-secret": "Secret or code requested — do not disclose based on urgency alone",
      travel: "Travel requested — independently verify the situation first",
      other: "Other requested action — verify independently before acting"
    }[action] || "Verify independently before acting";
  }

  return Object.freeze({
    claimTypes,
    requestedActions,
    verificationStates,
    channelTypes,
    channelResults,
    challengeResults,
    circleResults,
    validateCase,
    evaluateCase,
    consequenceLabel
  });
});
