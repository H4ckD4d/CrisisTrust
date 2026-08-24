# CrisisTrust

> **Open Human Safety & Verification Network**
>
> **Original creator, project owner, and primary maintainer: Chris Cruz | h4ckd4d**

**CrisisTrust** is an open-source, privacy-first project for turning urgent information into **source-aware, accessible, protective action** during crises.

## Start here — installation and beginner guide

New to GitHub, Python, or local development?

**Português (Brasil):** [`docs/GUIA-INSTALACAO-USO.pt-BR.md`](docs/GUIA-INSTALACAO-USO.pt-BR.md)

The guide includes Windows, Linux, and macOS installation; Python/Node/Git setup; local startup; dashboard usage; language switching; TrustCheck; Community Resource Verification; automated tests; updating with Git; and troubleshooting for common errors such as `Python was not found`, `Could not resolve host: github.com`, `cannot spawn less`, browser cache, port conflicts, and the harmless `favicon.ico 404` request.

Quick start after Git and Python are installed:

```bash
git clone https://github.com/H4ckD4d/CrisisTrust.git
cd CrisisTrust
python scripts/serve_local.py
```

Then open:

```text
http://127.0.0.1:8771
```

## Mission

> When people are afraid, information must become trust — and trust must become safe action.

CrisisTrust is designed for disasters, extreme weather, public warnings, family check-ins, community resilience, emergency-information verification, anti-impersonation workflows, multilingual accessibility, and public-resource verification.

It does not replace emergency authorities, emergency services, humanitarian operators, identity-assurance systems, payment authorization, or professional advice.

## Current capabilities

### v0.1 — Protocol foundation

- CAP-compatible alert envelopes;
- source provenance and integrity context;
- Action Cards preserving source instructions;
- minimal Trusted Circle check-ins;
- community-resource records;
- local-first reference dashboard and CI.

### v0.2 — TrustCheck

A conservative anti-impersonation workflow for urgent family, financial, and account-security claims.

```text
Urgent claim
    ↓
Independent channel initiated by the user
    ↓
Second trusted corroboration
    ↓
Preserve conflicts
    ↓
verified-by-process / unresolved / conflicting
```

Voice, caller ID, display names, profile photographs, urgency, public personal facts, and AI-generated identity confidence are not sufficient authentication.

See [`docs/trustcheck.md`](docs/trustcheck.md).

### v0.3 — Accessibility & Multilingual

- English — `en`
- Portuguese (Brazil) — `pt-BR`
- Spanish — `es`
- high contrast;
- larger text;
- reduced motion;
- low-bandwidth presentation;
- simple-language companion;
- separate `translation-record` objects;
- exact source-text binding before translations are displayed.

Translations never overwrite the original source instruction.

See [`docs/accessibility-multilingual.md`](docs/accessibility-multilingual.md).

### v0.4 — Community Resource Verification

v0.4 separates the identity of a public support resource from its time-bound verification history.

```text
Community Resource
        ↓
resource-verification[]
        ↓
Source + verifier + timestamp
        ↓
Supports / Contradicts / Inconclusive
        ↓
Freshness + Conflict handling
        ↓
verified / unverified / conflicting / stale / unavailable
```

The reference engine intentionally prevents:

```text
single community report
        ↓
automatic VERIFIED badge
```

A single community report remains useful evidence but requires stronger or independent corroboration before the resource reaches `verified`.

Current contradictory records produce `conflicting`; they are not averaged into a reassuring result.

v0.4 also models:

- verifier role;
- source class;
- availability;
- capacity state;
- accessibility state;
- evidence reference;
- configurable freshness window;
- verification history.

A local EN/PT-BR/ES reference console is available at:

```text
web/resources.html
```

See [`docs/community-resource-verification.md`](docs/community-resource-verification.md).

## Human-safety principles

1. Human safety before engagement.
2. Verified provenance before virality.
3. Official instructions before generated advice.
4. Independent verification before high-consequence action.
5. Original source text before translation substitution.
6. Conflicting evidence remains visible.
7. A community report is evidence, not automatic authority.
8. Privacy before tracking.
9. Consent before location sharing.
10. Accessibility by default.
11. Offline resilience where possible.
12. No advertising during suffering.
13. No sale of crisis data.
14. Open standards before vendor lock-in.

## What CrisisTrust does not do

CrisisTrust does not:

- claim that AI can determine whether an emergency is true;
- claim that voice, caller ID, or photographs prove identity;
- replace government/emergency-service instructions;
- silently overwrite authoritative text with translations;
- automatically mark community reports as authoritative;
- hide current conflicting resource reports;
- continuously track people;
- require precise personal location by default;
- sell crisis or family data;
- scrape private communications;
- use crisis status for advertising;
- store a family's prearranged TrustCheck secret;
- authorize payments or disclosure of secrets.

## Architecture

```text
Official Alert ──► Provenance ──► Action Card ──► Translation Companion
                                            │
Urgent Claim ──► TrustCheck ─────────────────┤
                                            │
Community Resource ──► Verification History ┤
                                            │
Trusted Circle ──────────────────────────────┘
                                            ↓
                              User-controlled safe action
```

## Protocol record types

CrisisTrust v0.4 defines:

```text
alert-envelope
action-card
checkin
community-resource
trustcheck-case
translation-record
resource-verification
```

See [`docs/protocol.md`](docs/protocol.md).

## Standards foundation

CrisisTrust uses OASIS **Common Alerting Protocol (CAP) 1.2** semantics for emergency-alert interoperability. WCAG 2.2 is used as an accessibility engineering reference, without claiming independent certification. New CrisisTrust translation records use BCP 47 style language tags.

## Privacy model

The reference clients are local-first:

- no analytics;
- no advertising SDKs;
- no cookies;
- no automatic local/session storage;
- no background location tracking;
- no external runtime requests;
- no biometric identity inference;
- no automatic online translation;
- synthetic fixtures for tests and demos.

## Repository layout

```text
CrisisTrust/
├── docs/
├── examples/
├── schemas/
├── scripts/
├── web/
│   ├── index.html
│   └── resources.html
├── CHANGELOG.md
├── CONTRIBUTING.md
├── DEVELOPERS.md
├── LICENSE
├── README.md
├── ROADMAP.md
└── SECURITY.md
```

## Developers wanted

We welcome developers, emergency-technology engineers, CAP implementers, anti-fraud researchers, accessibility specialists, privacy engineers, humanitarian technologists, disaster-risk specialists, emergency-management practitioners, NGO/civic-technology contributors, UX researchers, translators, localization engineers, QA engineers, technical writers, and assistive-technology users.

High-value contributions include resource freshness research, operator/verifier governance, moderation and abuse resistance, CAP interoperability, accessibility testing, additional language packs, offline synchronization, privacy-preserving trusted-circle design, synthetic fixtures, and open protocol review.

Accepted contributors receive credit through Git history, Pull Requests, releases, and acknowledgments. **Original authorship and project ownership remain attributed to Chris Cruz | h4ckd4d.**

## Project status

`v0.4-alpha` — Community Resource Verification profile, operational-state engine, conflict preservation, capacity/accessibility observations, and multilingual local verification console.

## License

MIT. See [`LICENSE`](LICENSE).

---

**Chris Cruz | h4ckd4d**  
Cybersecurity • Red Team • Advanced Cyber Defense & Intelligence  
OSCP | CEH | CISSP | MITRE ATT&CK® Contributor

**Founder — Project h4ckd4d**  
Technology for Child Protection • OSINT • Threat Intelligence

*"Protect. Detect. Defend."*
