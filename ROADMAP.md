# CrisisTrust Roadmap

**Project owner:** Chris Cruz | h4ckd4d

## v0.1 — Protocol Foundation

- [x] project principles;
- [x] architecture;
- [x] trust model;
- [x] CAP interoperability strategy;
- [x] privacy/security threat model;
- [x] JSON Schemas for core records;
- [x] synthetic fixtures;
- [x] local reference dashboard;
- [x] validation and CI;
- [x] contributor workflow.

## v0.2 — TrustCheck

- [x] independent-channel verification workflow for urgent family requests;
- [x] explicit `verified-by-process`, `unresolved`, and `conflicting` states;
- [x] prearranged-challenge result model without storing the secret;
- [x] Trusted Circle corroboration model;
- [x] high-consequence action warnings;
- [x] anti-impersonation UX;
- [x] TrustCheck JSON Schema and synthetic fixture;
- [x] reusable TrustCheck engine and automated tests;
- [x] local dashboard integration;
- [x] privacy validation and CI coverage.

Voice, caller ID, profile photos, emotional pressure, public personal facts, and AI identity scores do not independently authenticate a person in the TrustCheck protocol.

## v0.3 — Accessibility & Multilingual

- [x] English, Portuguese (Brazil), and Spanish interface architecture;
- [x] BCP 47 style language tags for translation records;
- [x] separate `translation-record` protocol contract;
- [x] exact source-text binding before companion translations are displayed;
- [x] visible translation review states;
- [x] simple-language companion text without rewriting source instructions;
- [x] keyboard-visible focus treatment;
- [x] screen-reader-oriented semantic/live-region improvements;
- [x] reduced-motion profile and `prefers-reduced-motion` support;
- [x] high-contrast profile;
- [x] larger-text profile;
- [x] low-bandwidth presentation mode;
- [x] accessible TrustCheck presentation in EN/PT-BR/ES;
- [x] automated i18n, translation-safety, and accessibility structure tests;
- [x] WCAG 2.2 engineering reference documented without claiming certification.

Human testing with assistive technology and broader humanitarian terminology review remain ongoing community activities rather than claimed automated conformance.

## v0.4 — Community Resource Verification

- resource lifecycle;
- verification roles;
- stale-resource detection;
- capacity/availability freshness;
- source history;
- moderation and abuse controls.

## v0.5 — Offline Resilience

Research and prototype:

- offline-first PWA;
- intermittent-connectivity sync;
- conflict resolution;
- privacy-preserving trusted-circle synchronization;
- data-retention controls.

## v0.6 — Humanitarian / Municipality Node

- self-hosted node specification;
- NGO/community deployment model;
- local authority adapters;
- audit log specification;
- accessibility and language packs.

## v1.0 — Open CrisisTrust Protocol

Stable contracts for:

- alert envelope;
- provenance;
- Action Card;
- check-in;
- TrustCheck case;
- translation record;
- community resources;
- protocol version negotiation;
- integrity extensions;
- offline synchronization profile.

## Non-goals

CrisisTrust will not become:

- an advertising network;
- a people-tracking platform;
- a private-message surveillance platform;
- an AI emergency-command system;
- a biometric identity oracle;
- a payment authorization system;
- a replacement for public emergency authorities.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
