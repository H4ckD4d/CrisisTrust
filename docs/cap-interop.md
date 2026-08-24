# CAP Interoperability

**Project owner:** Chris Cruz | h4ckd4d

## Why CAP

The Common Alerting Protocol (CAP) 1.2 is an OASIS standard for exchanging all-hazard emergency alerts and public warnings across different networks and media.

Official references:

- OASIS CAP 1.2: <https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2.html>
- WMO CAP program: <https://wmo.int/activities/common-alerting-protocol-cap>
- WMO Register of Alerting Authorities information: <https://wmo.int/site/wmo-common-alerting-protocol>

## CrisisTrust approach

CrisisTrust does not replace CAP. It adds a user-facing coordination layer around CAP-compatible semantics.

```text
CAP message
    ↓
CAP adapter
    ↓
CrisisTrust alert envelope
    ↓
Provenance + integrity metadata
    ↓
Action Card / local coordination
```

## Core CAP concepts preserved

CrisisTrust preserves the following high-value concepts when available:

- identifier;
- sender/source identity;
- sent time;
- status;
- message type;
- scope;
- event;
- response type;
- urgency;
- severity;
- certainty;
- headline/description;
- instruction;
- effective/onset/expiry time;
- area description;
- language.

## Multilingual CAP messages

CAP 1.2 permits multiple `info` blocks and includes a `language` element for the language of an `info` block. CrisisTrust adapters should preserve those source-language relationships instead of flattening different languages into one unlabeled string.

For v0.3, the recommended flow is:

```text
CAP source content
        ↓
Preserve original language + instruction
        ↓
CrisisTrust alert-envelope
        ↓
Optional translation-record
        ↓
Original and companion translation shown separately
```

A source-provided CAP language variant is not the same thing as a later community or machine-assisted translation. Implementations should preserve that distinction in provenance and presentation.

CrisisTrust `translation-record` objects use BCP 47 style language tags. CAP's own language field remains preserved as source metadata.

## Translation safety

A companion translation must not silently overwrite the CAP-derived source instruction.

The reference client requires the translation's `source_text` to exactly match the referenced source field before displaying it. Language and review status remain visible to the user.

See [`accessibility-multilingual.md`](accessibility-multilingual.md).

## Provenance extension

CAP describes the message and sender. CrisisTrust separately records how the local implementation established source provenance:

```text
source_status
integrity_status
registry_reference
source_reference
```

This metadata must remain explainable to the user.

## WMO authority registry

For meteorological and hydrological alerting, the WMO Register of Alerting Authorities can help establish that an issuer is a recognized authority for designated alerting areas.

A registry match should be represented as provenance evidence, not as a claim that every message can never contain an error or become outdated.

## Security

CAP 1.2 supports XML signatures/encryption constructs. Future CrisisTrust adapters should preserve signature-related evidence and validate it using well-maintained libraries rather than custom cryptography.

## Current limitation

The alpha does not fetch live public alerts. It uses synthetic fixtures only so that the protocol, UX, translation model, and validation rules can mature before network ingestion is introduced.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
