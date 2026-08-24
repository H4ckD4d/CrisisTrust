# CrisisTrust

> **Open Human Safety & Verification Network**
>
> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

**CrisisTrust** is an open-source, privacy-first project for turning urgent information into **source-aware, accessible, protective action** during crises.

The project addresses the gap between:

```text
Something happened
        ↓
Where did this information come from?
        ↓
What does the official source actually say?
        ↓
Can I understand it in my language without losing the original?
        ↓
Is an urgent personal claim independently corroborated?
        ↓
Who in my trusted circle has checked in?
        ↓
What verified community resources are available?
```

## Mission

> When people are afraid, information must become trust — and trust must become safe action.

CrisisTrust is designed for disasters, extreme weather, public warnings, family check-ins, community resilience, emergency-information verification, and high-pressure impersonation scenarios. It does not replace emergency authorities, emergency services, identity-assurance systems, payment authorization, or professional advice.

## v0.1 — Protocol foundation

The first milestone established:

1. **AlertTrust** — normalized alert envelopes with CAP-compatible concepts.
2. **Source Provenance** — source and integrity evidence remain visible.
3. **Action Cards** — authoritative instructions remain preserved.
4. **Trusted Circle Check-in** — session-only safety status without permanent location tracking.
5. **Community Resources** — source-aware public support resources with freshness metadata.

## v0.2 — TrustCheck

TrustCheck adds a conservative anti-impersonation workflow for urgent family, financial, or account-security claims.

```text
Urgent claim
    ↓
Do not trust urgency, voice, or caller ID alone
    ↓
Initiate a known independent channel
    ↓
Confirm / deny / no response
    ↓
Prearranged challenge or Trusted Circle corroboration
    ↓
Preserve any conflicts
    ↓
verified-by-process / unresolved / conflicting
```

A case reaches `verified-by-process` only when an independently initiated known/official channel confirms the claim, a second trusted corroboration is present, and no material verification result conflicts with the claim.

`verified-by-process` is not a guarantee of identity, factual accuracy, or safety.

See [`docs/trustcheck.md`](docs/trustcheck.md).

## v0.3 — Accessibility & Multilingual

v0.3 makes the reference client usable across more languages, abilities, devices, and connectivity conditions while protecting the original emergency message.

### Interface languages

- English — `en`
- Portuguese (Brazil) — `pt-BR`
- Spanish — `es`

### Accessibility profiles

The local dashboard now includes session-only controls for:

- high contrast;
- larger text;
- reduced motion;
- low-bandwidth presentation;
- simple-language companion text.

The project uses **WCAG 2.2** as an engineering and review reference. CrisisTrust does not claim formal accessibility certification without independent conformance testing.

### Translation safety

Translations are represented as separate `translation-record` objects.

```text
Original source instruction
          │
          ├───────────────┐
          ▼               ▼
     Original text   Companion translation
          │               │
          │        language + review status
          │               │
          └───────┬───────┘
                  ▼
       both remain visible
```

A companion translation is accepted only when its `subject_id`, source field, source language, and `source_text` match the loaded source record. It never replaces the original source instruction.

Translation review states include:

- `source-provided`;
- `human-reviewed`;
- `machine-assisted-unreviewed`;
- `translator-declared`;
- `unverified`.

New translation records use BCP 47 style language tags. CAP source-language semantics remain preserved.

See [`docs/accessibility-multilingual.md`](docs/accessibility-multilingual.md).

## Human-safety principles

1. Human safety before engagement.
2. Verified provenance before virality.
3. Official instructions before generated advice.
4. Independent verification before high-consequence action.
5. Original source text before translation substitution.
6. Privacy before tracking.
7. Consent before location sharing.
8. Accessibility by default.
9. Offline resilience where possible.
10. No advertising during suffering.
11. No sale of crisis data.
12. Open standards before vendor lock-in.

## What CrisisTrust does not do

CrisisTrust does not:

- claim that AI can determine whether an emergency is true;
- claim that voice, caller ID, or a photograph proves identity;
- replace government or emergency-service instructions;
- silently overwrite authoritative text with a translation;
- call an online translation provider from the reference client;
- infer a user's native language;
- continuously track people;
- collect precise personal location by default;
- sell crisis or family data;
- profile individuals;
- scrape private communications;
- use fear, urgency, or crisis status for advertising;
- automatically mark community reports as authoritative;
- store a family's prearranged challenge secret in TrustCheck records;
- authorize payments or disclosure of secrets.

## Architecture

```text
Official / Declared Source                 Urgent Personal Claim
          ↓                                         ↓
Source Provenance                           Independent Verification
          ↓                                         ↓
Normalized Alert Envelope                      TrustCheck Case
          ↓                                         ↓
CAP-Compatible Semantics                 Corroboration / Conflict
          ↓                                         ↓
Original Action Card                     Verification State
          │                                         │
          ├──── translation-record ────┐            │
          │                            ▼            │
          │                 Companion Translation   │
          └──────────────────┬──────────────────────┘
                             ↓
                 Trusted Circle + Community Resources
                             ↓
                  User-controlled protective action
```

See [`docs/architecture.md`](docs/architecture.md), [`docs/trust-model.md`](docs/trust-model.md), [`docs/protocol.md`](docs/protocol.md), [`docs/trustcheck.md`](docs/trustcheck.md), and [`docs/accessibility-multilingual.md`](docs/accessibility-multilingual.md).

## Standards foundation

CrisisTrust uses the **OASIS Common Alerting Protocol (CAP) 1.2** as the initial emergency-alert interoperability reference. CAP provides emergency concepts such as event, severity, urgency, certainty, area information, instructions, and source language.

The v0.3 accessibility profile uses **WCAG 2.2** as an engineering reference and BCP 47 style language tags for CrisisTrust translation records.

For meteorological and hydrological alerting authorities, the project treats the **WMO Register of Alerting Authorities (RAA)** as an important reference for authority provenance. Registration is evidence about an issuer's authority; it is not a general-purpose truth oracle.

## Privacy model

The reference web prototype is local-first:

- no analytics;
- no advertising SDKs;
- no cookies;
- no automatic local/session storage;
- no background location tracking;
- no external runtime requests;
- no biometric identity inference;
- no automatic online translation;
- no storage of prearranged challenge secrets;
- imported data rendered with safe text APIs;
- accessibility preferences exist only in the active browser session.

## Repository layout

```text
CrisisTrust/
├── docs/
├── examples/
├── schemas/
├── scripts/
├── web/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── DEVELOPERS.md
├── LICENSE
├── README.md
├── ROADMAP.md
└── SECURITY.md
```

## Developers wanted

We welcome developers, emergency-technology engineers, CAP implementers, anti-fraud researchers, accessibility specialists, privacy engineers, humanitarian technologists, disaster-risk specialists, UX researchers, translators, localization engineers, QA engineers, technical writers, assistive-technology users, and community-resilience practitioners.

High-value contributions include:

- CAP interoperability;
- provenance and integrity models;
- anti-impersonation verification research;
- screen-reader and keyboard testing;
- Portuguese and Spanish terminology review;
- additional BCP 47 language packs;
- low-bandwidth and cognitive-load testing;
- offline-first synchronization research;
- community-resource verification;
- privacy-preserving trusted-circle design;
- threat modeling and abuse resistance;
- synthetic fixtures and tests;
- open protocol review.

Accepted contributors receive credit through Git history, Pull Requests, releases, and acknowledgments. **Original authorship and project ownership remain attributed to Chris Cruz | h4ckd4d.**

## Project status

`v0.3-alpha` — accessibility, multilingual interface, translation safety profile, and local companion translations.

## License

MIT. See [`LICENSE`](LICENSE).

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
