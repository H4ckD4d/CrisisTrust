# CrisisTrust Protocol v0.3

**Status:** Alpha draft  
**Project owner:** Chris Cruz | h4ckd4d

## Purpose

The CrisisTrust Protocol defines interoperable safety records that can be implemented by different clients without requiring a centralized vendor.

## Record types

v0.3 defines six record types:

1. `alert-envelope`
2. `action-card`
3. `checkin`
4. `community-resource`
5. `trustcheck-case`
6. `translation-record`

Each type has a JSON Schema under `schemas/`.

## 1. Alert envelope

The alert envelope normalizes authoritative or community alert input without discarding provenance.

Required concepts:

```text
record_type
protocol_version
alert_id
source
source_status
integrity_status
sent_at
event
severity
urgency
certainty
area_description
instruction
```

Optional fields may include effective/expiry timestamps, language, CAP identifier, source URL, and human-readable description.

### CAP mapping

| CrisisTrust | CAP 1.2 concept |
| --- | --- |
| `alert_id` | `identifier` |
| `sent_at` | `sent` |
| `event` | `event` |
| `severity` | `severity` |
| `urgency` | `urgency` |
| `certainty` | `certainty` |
| `area_description` | `areaDesc` |
| `instruction` | `instruction` |
| `language` | `language` |

CrisisTrust adds explicit provenance/integrity fields because consumers need to know not only what an alert says, but what evidence supports issuer attribution and message integrity.

## 2. Action Card

An Action Card is a presentation-oriented derivative of an alert envelope.

It must preserve:

- source identity;
- provenance status;
- integrity status;
- event;
- severity/urgency/certainty;
- affected-area description;
- source instruction;
- source language;
- freshness/expiry state.

**Critical rule:** Action Cards must not silently replace authoritative instructions with LLM-generated, translated, simplified, or otherwise rewritten emergency instructions.

Companion translations and simple-language explanations must remain distinguishable from the source instruction.

## 3. Check-in

A check-in has minimal state:

```json
{
  "record_type": "checkin",
  "protocol_version": "0.1",
  "checkin_id": "CT-CHECKIN-DEMO-001",
  "alias": "Family member A",
  "status": "safe",
  "updated_at": "2026-08-23T20:00:00Z"
}
```

Allowed statuses:

- `safe`
- `need-assistance`
- `unknown`

No precise location is required.

## 4. Community resource

A resource record describes a public service/resource location. It is not a person-tracking record.

Required concepts include resource identifier, resource type, display name, area/address description, source, verification status, verification time when available, and availability note.

## 5. TrustCheck case

A TrustCheck case records the verification process for an urgent claim without requiring personal contact details, private-message contents, biometric data, or the prearranged secret itself.

Required concepts:

```text
record_type = trustcheck-case
protocol_version = 0.2
case_id
claim_type
received_at
requested_action
verification_state
channels[]
challenge
trusted_circle[]
```

Verification states are:

- `unreviewed`;
- `verifying`;
- `verified-by-process`;
- `unresolved`;
- `conflicting`;
- `cancelled`.

### TrustCheck rule

`verified-by-process` requires:

1. confirmation through at least one independently initiated known or official channel;
2. a second trusted corroboration from either a prearranged challenge or Trusted Circle confirmation;
3. no material denial or failed prearranged challenge.

Conflicting evidence must not be averaged away.

The protocol does not treat familiar voice, caller ID, display names, profile photographs, urgency, public personal facts, or AI-generated identity confidence as sufficient identity proof.

See [`trustcheck.md`](trustcheck.md).

## 6. Translation record

A translation record is a companion record. It does not mutate or replace its source record.

Required concepts:

```text
record_type = translation-record
protocol_version = 0.3
translation_id
subject_id
field
source_language
target_language
source_text
translated_text
translation_status
```

The supported core fields are:

- `event`;
- `description`;
- `instruction`;
- `area_description`.

### Language tags

CrisisTrust v0.3 translation records use well-formed BCP 47 style language tags such as:

```text
en
pt-BR
es
fr-CA
zh-Hant
```

CAP source-language metadata is preserved. A translation record describes an additional companion representation.

### Translation status

Allowed values are:

- `source-provided`;
- `human-reviewed`;
- `machine-assisted-unreviewed`;
- `translator-declared`;
- `unverified`.

A translation status describes provenance/review state. It is not a guarantee of perfect linguistic accuracy.

### Source binding rule

A reference client must not attach a translation to a source record unless:

1. `subject_id` identifies the loaded source record;
2. the declared field exists in that source record;
3. `source_text` exactly equals that source field;
4. declared source language matches the source language when available.

A mismatch must remain visible as a rejection rather than being silently corrected.

See [`accessibility-multilingual.md`](accessibility-multilingual.md).

## Accessibility profile

The v0.3 reference implementation provides session-only language and accessibility preferences. WCAG 2.2 is used as an engineering reference, not as a claim of independent certification.

Reference-client controls include:

- interface language;
- high contrast;
- larger text;
- reduced motion;
- low-bandwidth presentation;
- simple-language companion explanations.

Simple-language companion text must not replace the source instruction.

## Versioning

Protocol versions use semantic milestone numbering during incubation:

```text
0.1 — alert/provenance foundation
0.2 — TrustCheck anti-impersonation workflow
0.3 — accessibility, multilingual, and translation-safety profile
0.4 — community-resource verification profile
0.5 — offline synchronization draft
1.0 — stable interoperability contract
```

Breaking schema changes before 1.0 require explicit migration notes.

## Extension policy

Implementations may add namespaced extension objects, but must not redefine the meaning of core fields.

## Privacy policy

A compliant reference client should not require:

- precise personal GPS history;
- advertising identifiers;
- device fingerprinting;
- private messages;
- credentials;
- payment details;
- recovery codes;
- voice recordings;
- face images;
- biometric identity inference;
- online translation-service submission.

## Safety policy

CrisisTrust records are informational and coordination primitives. They do not replace emergency authorities, emergency services, professional instructions, identity-assurance systems, or payment authorization.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
