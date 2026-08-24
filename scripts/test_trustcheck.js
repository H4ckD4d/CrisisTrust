"use strict";

const assert = require("node:assert/strict");
const TrustCheck = require("../web/trustcheck-core.js");

function baseCase() {
  return {
    record_type: "trustcheck-case",
    protocol_version: "0.2",
    case_id: "CT-TEST-TRUST-001",
    claim_type: "family-emergency",
    subject_alias: "Trusted family member",
    claim_summary: "Synthetic urgent claim.",
    received_at: "2026-08-23T21:00:00Z",
    requested_action: "transfer-money",
    verification_state: "verifying",
    channels: [
      {
        channel_id: "known-channel",
        channel_type: "known-phone",
        independently_initiated: true,
        result: "confirmed"
      }
    ],
    challenge: { was_prearranged: true, result: "passed" },
    trusted_circle: [{ alias: "Trusted contact A", result: "confirmed" }]
  };
}

const verified = baseCase();
assert.deepEqual(TrustCheck.validateCase(verified), []);
assert.equal(TrustCheck.evaluateCase(verified).state, "verified-by-process");

const onlyIncomingStyleEvidence = baseCase();
onlyIncomingStyleEvidence.channels = [
  {
    channel_id: "incoming-channel",
    channel_type: "known-phone",
    independently_initiated: false,
    result: "confirmed"
  }
];
assert.equal(TrustCheck.evaluateCase(onlyIncomingStyleEvidence).state, "unresolved");

const oneIndependentOnly = baseCase();
oneIndependentOnly.challenge = { was_prearranged: false, result: "not-used" };
oneIndependentOnly.trusted_circle = [];
assert.equal(TrustCheck.evaluateCase(oneIndependentOnly).state, "unresolved");

const denied = baseCase();
denied.channels.push({
  channel_id: "second-channel",
  channel_type: "known-messaging",
  independently_initiated: true,
  result: "denied"
});
assert.equal(TrustCheck.evaluateCase(denied).state, "conflicting");

const failedChallenge = baseCase();
failedChallenge.challenge = { was_prearranged: true, result: "failed" };
assert.equal(TrustCheck.evaluateCase(failedChallenge).state, "conflicting");

const circleDenial = baseCase();
circleDenial.trusted_circle = [{ alias: "Trusted contact A", result: "denied" }];
assert.equal(TrustCheck.evaluateCase(circleDenial).state, "conflicting");

const invalidChallenge = baseCase();
invalidChallenge.challenge = { was_prearranged: false, result: "passed" };
assert.ok(TrustCheck.validateCase(invalidChallenge).length > 0);

const cancelled = baseCase();
cancelled.verification_state = "cancelled";
assert.equal(TrustCheck.evaluateCase(cancelled).state, "cancelled");

assert.match(TrustCheck.consequenceLabel("transfer-money"), /verify independently/i);
assert.match(TrustCheck.consequenceLabel("share-secret"), /do not disclose/i);

const serialized = JSON.stringify(baseCase());
for (const forbidden of ["password", "recovery_code", "latitude", "longitude", "voice_recording", "face_image"]) {
  assert.equal(serialized.includes(forbidden), false);
}

console.log("CrisisTrust TrustCheck tests passed.");
