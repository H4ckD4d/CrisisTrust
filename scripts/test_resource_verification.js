"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const core = require("../web/resource-verification-core.js");
const root = path.resolve(__dirname, "..");
const resources = JSON.parse(fs.readFileSync(path.join(root, "examples/resources.synthetic.json"), "utf8"));
const verifications = JSON.parse(fs.readFileSync(path.join(root, "examples/resource-verifications.synthetic.json"), "utf8"));

for (const record of verifications) {
  assert.deepStrictEqual(core.validateVerification(record), []);
}

const now = new Date("2026-08-23T18:30:00Z");
const first = core.deriveResourceState(resources[0], verifications, { now, maxAgeMinutes: 120 });
assert.strictEqual(first.state, "verified");
assert.strictEqual(first.freshness, "current");
assert.ok(first.support_count >= 2);

const snapshot = core.latestOperationalSnapshot(resources[0], verifications, { now, maxAgeMinutes: 120 });
assert.strictEqual(snapshot.availability, "available");
assert.strictEqual(snapshot.capacity.status, "limited");
assert.strictEqual(snapshot.accessibility.status, "confirmed");

const second = core.deriveResourceState(resources[1], verifications, { now: new Date("2026-08-23T12:30:00Z"), maxAgeMinutes: 120 });
assert.strictEqual(second.state, "conflicting");
assert.ok(second.conflict_count >= 1);

const stale = core.deriveResourceState(resources[0], verifications, { now: new Date("2026-08-24T02:30:00Z"), maxAgeMinutes: 120 });
assert.strictEqual(stale.state, "stale");

const communityOnly = [{
  record_type: "resource-verification",
  protocol_version: "0.4",
  verification_id: "CT-RV-COMMUNITY-ONLY",
  resource_id: resources[0].resource_id,
  observed_at: "2026-08-23T18:20:00Z",
  verifier_role: "community-report",
  source_class: "community-report",
  availability: "available",
  verification_result: "supports"
}];
assert.strictEqual(core.deriveResourceState(resources[0], communityOnly, { now }).state, "unverified");

const unavailable = [{
  record_type: "resource-verification",
  protocol_version: "0.4",
  verification_id: "CT-RV-UNAVAILABLE",
  resource_id: resources[0].resource_id,
  observed_at: "2026-08-23T18:25:00Z",
  verifier_role: "operator",
  source_class: "operator-confirmation",
  availability: "unavailable",
  verification_result: "supports"
}];
assert.strictEqual(core.deriveResourceState(resources[0], unavailable, { now }).state, "unavailable");

console.log("CrisisTrust community-resource verification tests passed.");
