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
What protective action is recommended?
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

## v0.1 foundation

The first milestone established five capabilities:

1. **AlertTrust** — ingest a normalized alert envelope derived from an official alert source, including CAP-compatible fields.
2. **Source Provenance** — record who issued an alert, how the source was identified, and whether message integrity was checked.
3. **Action Cards** — display the instruction provided by the authoritative source without inventing new emergency guidance.
4. **Trusted Circle Check-in** — session-only `safe`, `need-assistance`, or `unknown` status without permanent location tracking.
5. **Community Resources** — structured resources such as shelters, cooling centers, charging points, or official information points with source and verification metadata.

## v0.2 TrustCheck

TrustCheck adds a conservative verification workflow for urgent family, financial, or account-security claims.

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

`verified-by-process` is not a guarantee of identity, factual accuracy, or safety. It means the documented TrustCheck process reached its defined corroboration threshold.

TrustCheck deliberately does **not** use familiar voice, caller ID, profile photos, display names, emotional pressure, public personal facts, or AI-generated identity confidence as sufficient authentication.

See [`docs/trustcheck.md`](docs/trustcheck.md).

## Human-safety principles

1. Human safety before engagement.
2. Verified provenance before virality.
3. Official instructions before generated advice.
4. Independent verification before high-consequence action.
5. Privacy before tracking.
6. Consent before location sharing.
7. Accessibility by default.
8. Offline resilience where possible.
9. No advertising during suffering.
10. No sale of crisis data.
11. Open standards before vendor lock-in.

## What CrisisTrust does not do

CrisisTrust does not:

- claim that AI can determine whether an emergency is true;
- claim that voice, caller ID, or a photograph proves identity;
- replace government or emergency-service instructions;
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
Human-readable Action Card             Verification State
          └──────────────────┬──────────────────────┘
                             ↓
                 Trusted Circle + Community Resources
                             ↓
                  User-controlled protective action
```

See [`docs/architecture.md`](docs/architecture.md), [`docs/trust-model.md`](docs/trust-model.md), [`docs/protocol.md`](docs/protocol.md), and [`docs/trustcheck.md`](docs/trustcheck.md).

## Standards foundation

CrisisTrust uses the **OASIS Common Alerting Protocol (CAP) 1.2** as the initial emergency-alert interoperability reference. CAP standardizes concepts such as event, severity, urgency, certainty, area information, and instructions.

For meteorological and hydrological alerting authorities, the project treats the **WMO Register of Alerting Authorities (RAA)** as an important reference for authority provenance. Registration is evidence about the issuer's authority; it is not a general-purpose truth oracle for every kind of crisis information.

See [`docs/cap-interop.md`](docs/cap-interop.md).

## Privacy model

The reference web prototype is designed to be local-first:

- no analytics;
- no advertising SDKs;
- no cookies;
- no automatic local/session storage;
- no background location tracking;
- no external runtime requests;
- no biometric identity inference;
- no storage of prearranged challenge secrets;
- imported demo/user data rendered with safe text APIs;
- export only when the user explicitly requests it.

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

We welcome developers, emergency-technology engineers, CAP implementers, anti-fraud researchers, accessibility specialists, privacy engineers, humanitarian technologists, disaster-risk specialists, UX researchers, translators, QA engineers, technical writers, and community-resilience practitioners.

High-value contributions include:

- CAP interoperability;
- provenance and integrity models;
- anti-impersonation and independent-channel verification research;
- accessibility and multilingual design;
- offline-first synchronization research;
- community-resource verification;
- privacy-preserving trusted-circle design;
- threat modeling and abuse resistance;
- synthetic fixtures and tests;
- humanitarian UX research;
- open protocol review.

Accepted contributors receive credit through Git history, Pull Requests, releases, and acknowledgments. **Original authorship and project ownership remain attributed to Chris Cruz | h4ckd4d.**

## Project status

`v0.2-alpha` — TrustCheck anti-impersonation verification workflow and protocol extension.

## License

MIT. See [`LICENSE`](LICENSE).

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
