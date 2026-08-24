"use strict";

const claimType = document.getElementById("trustClaimType");
const requestedAction = document.getElementById("trustRequestedAction");
const independentResult = document.getElementById("trustIndependentResult");
const challengeResult = document.getElementById("trustChallengeResult");
const circleResult = document.getElementById("trustCircleResult");
const evaluateButton = document.getElementById("trustEvaluate");
const trustResult = document.getElementById("trustCheckResult");
const trustReason = document.getElementById("trustCheckReason");
const trustConsequence = document.getElementById("trustCheckConsequence");

function buildSessionCase() {
  const challengeValue = challengeResult.value;
  const circleValue = circleResult.value;
  return {
    record_type: "trustcheck-case",
    protocol_version: "0.2",
    case_id: "CT-SESSION-TRUSTCHECK",
    claim_type: claimType.value,
    received_at: new Date().toISOString(),
    requested_action: requestedAction.value,
    verification_state: "verifying",
    channels: [
      {
        channel_id: "independent-session-channel",
        channel_type: "known-phone",
        independently_initiated: true,
        result: independentResult.value
      }
    ],
    challenge: {
      was_prearranged: challengeValue !== "not-used",
      result: challengeValue
    },
    trusted_circle: circleValue === "not-asked"
      ? []
      : [{ alias: "Trusted contact", result: circleValue }]
  };
}

function renderResult(result, action) {
  trustResult.textContent = result.state;
  trustResult.className = `trustcheck-result ${result.state}`;
  trustReason.textContent = result.reason;
  trustConsequence.textContent = CrisisTrustTrustCheck.consequenceLabel(action);
}

evaluateButton.addEventListener("click", () => {
  const item = buildSessionCase();
  const errors = CrisisTrustTrustCheck.validateCase(item);
  if (errors.length) {
    renderResult({ state: "unresolved", reason: errors.join(" ") }, item.requested_action);
    return;
  }
  renderResult(CrisisTrustTrustCheck.evaluateCase(item), item.requested_action);
});
