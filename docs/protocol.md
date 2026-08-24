# CrisisTrust Protocol v0.4

**Status:** Alpha draft  
**Project owner:** Chris Cruz | h4ckd4d

## Purpose

The CrisisTrust Protocol defines interoperable safety records that different clients can implement without requiring a centralized vendor.

## Record types

v0.4 defines seven record types:

1. `alert-envelope`
2. `action-card`
3. `checkin`
4. `community-resource`
5. `trustcheck-case`
6. `translation-record`
7. `resource-verification`

Each machine-readable type has a JSON Schema under `schemas/` when applicable.

## 1. Alert envelope

Normalizes an authoritative or community alert while retaining provenance, integrity, time, event, severity, urgency, certainty, affected area, language, and source instruction.

CrisisTrust preserves CAP-compatible semantics including identifier, sent time, event, severity, urgency, certainty, area description, instruction, and language.

## 2. Action Card

A presentation-oriented derivative of an alert envelope.

It must preserve source identity, provenance, integrity, source instruction, source language, affected area, and freshness state.

**Critical rule:** an Action Card must not silently replace authoritative instructions with generated, translated, simplified, or otherwise rewritten emergency instructions.

## 3. Check-in

Minimal trusted-circle state:

- `safe`
- `need-assistance`
- `unknown`

Precise location is not required.

## 4. Community resource

Describes a public support resource such as a shelter, cooling center, water point, charging point, medical resource, or official information point.

The resource record describes identity/stable descriptive information. Operational verification history is represented separately by `resource-verification` records.

## 5. TrustCheck case

Records a privacy-first verification workflow for urgent personal claims.

`verified-by-process` requires an independently initiated known/official channel plus a second trusted corroboration, with no material conflicting result.

Familiar voice, caller ID, display names, profile photographs, urgency, public personal facts, and AI identity confidence are not sufficient authentication.

See [`trustcheck.md`](trustcheck.md).

## 6. Translation record

A companion representation linked to an exact source record and field.

It contains source/target language, exact source text, translated text, and review/provenance status.

A translation never mutates or replaces its source instruction.

See [`accessibility-multilingual.md`](accessibility-multilingual.md).

## 7. Resource verification

A `resource-verification` is a time-bound operational observation about a `community-resource`.

Required core concepts:

```text
record_type = resource-verification
protocol_version = 0.4
verification_id
resource_id
observed_at
verifier_role
source_class
availability
verification_result
```

Optional operational metadata includes capacity, accessibility, evidence reference, and a short note.

### Verifier roles

- `authority`
- `operator`
- `partner-organization`
- `trained-community-verifier`
- `community-report`
- `unknown`

### Source classes

- `official-record`
- `operator-confirmation`
- `partner-confirmation`
- `direct-observation`
- `community-report`
- `unknown`

Role and source class remain separate to keep provenance explainable.

### Verification result

Each record declares one of:

- `supports`
- `contradicts`
- `inconclusive`

### Derived operational states

The reference engine derives:

- `verified`
- `unverified`
- `conflicting`
- `stale`
- `unavailable`

A single community report does not automatically produce `verified`.

Current contradictory evidence must remain visible as `conflicting` instead of being averaged away.

### Freshness

Verification state depends on time. Implementations use a configurable freshness window appropriate to resource type and crisis context.

The synthetic v0.4 reference console uses 120 minutes for deterministic testing.

### Capacity and accessibility

Capacity and accessibility are operational observations, not permanent guarantees. Their state must remain associated with the observation time/source.

See [`community-resource-verification.md`](community-resource-verification.md).

## Accessibility profile

The reference implementation provides session-only EN/PT-BR/ES presentation, visible keyboard focus, reduced-motion support, high-contrast and larger-text profiles, low-bandwidth presentation, and simple-language companion text.

WCAG 2.2 is an engineering reference, not a claim of independent certification.

## Versioning

```text
0.1 — alert/provenance foundation
0.2 — TrustCheck anti-impersonation workflow
0.3 — accessibility, multilingual, and translation safety
0.4 — community-resource verification
0.5 — offline synchronization draft
0.6 — humanitarian / municipality node
1.0 — stable interoperability contract
```

Breaking schema changes before 1.0 require migration notes.

## Privacy policy

A compliant reference client should not require precise personal GPS history, advertising identifiers, device fingerprinting, private messages, credentials, payment details, recovery codes, voice recordings, face images, biometric identity inference, or automatic online translation.

Resource verification describes public support resources; it must not become a people-tracking record.

## Safety policy

CrisisTrust records are information and coordination primitives. They do not replace emergency authorities, emergency services, humanitarian operators, professional instructions, identity-assurance systems, or payment authorization.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
