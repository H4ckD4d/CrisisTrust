# CrisisTrust Accessibility & Multilingual Profile v0.3

**Project owner:** Chris Cruz | h4ckd4d

## Purpose

CrisisTrust v0.3 adds an accessibility and multilingual profile for crisis interfaces where stress, disability, language barriers, limited connectivity, and reduced attention can affect a person's ability to understand urgent information.

The implementation uses **WCAG 2.2** as an engineering reference and **BCP 47** style language tags for language identification. This project does **not** claim formal WCAG certification or legal conformance without independent testing.

## Core safety rule

A translated emergency instruction must never silently replace the original source instruction.

The reference client displays:

```text
Original source text
        +
Companion translation
        +
Source language
        +
Target language
        +
Translation review status
```

If a translation record does not exactly match the loaded source field, the client rejects it.

## Supported interface languages in v0.3

- English — `en`
- Portuguese (Brazil) — `pt-BR`
- Spanish — `es`

The protocol does not restrict future implementations to these languages.

## Language tags

New CrisisTrust translation records use well-formed BCP 47 style language tags.

Examples:

```text
en
pt-BR
es
fr-CA
zh-Hant
```

CAP 1.2 already includes language semantics for `info` blocks. CrisisTrust preserves that source-language context and adds a separate translation record when a companion translation is needed.

## Translation record

`translation-record` is a v0.3 protocol record.

Required fields include:

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

Allowed `translation_status` values are:

- `source-provided`
- `human-reviewed`
- `machine-assisted-unreviewed`
- `translator-declared`
- `unverified`

A status describes the review/provenance state of the translation. It is not a guarantee that every wording choice is correct.

## Translation integrity rule

The reference client only presents a companion translation when:

1. the translation record is structurally valid;
2. `subject_id` matches the loaded alert;
3. the referenced field exists;
4. `source_text` exactly equals the source field;
5. the declared source language matches the source alert when the alert declares a language.

This prevents a translation prepared for one message from being attached to a different emergency instruction.

## Accessibility controls

The v0.3 reference dashboard provides session-only controls for:

- interface language;
- high contrast;
- larger text;
- reduced motion;
- low-bandwidth presentation.

These preferences are not automatically written to browser storage.

## Keyboard and focus

The dashboard uses native form controls and buttons, provides a skip link, and applies a visible `:focus-visible` indicator.

Interactive functionality must remain operable without pointer-only gestures.

## Screen readers

The reference client uses:

- semantic headings;
- associated labels;
- `aria-live` status regions for imported data and verification outcomes;
- language attributes on original and translated emergency text;
- visually hidden status text where appropriate.

Automated checks do not replace testing with real assistive technology.

## Reduced motion

The dashboard honors `prefers-reduced-motion: reduce` and also offers a session-only manual reduced-motion control.

## High contrast and larger text

High-contrast and larger-text profiles alter CSS variables and root font sizing without changing the underlying information hierarchy.

Content must remain usable when text size increases.

## Low-bandwidth mode

The low-bandwidth profile removes decorative gradients and visual effects. It does not disable safety-critical content, verification states, provenance, or instructions.

The v0.3 dashboard still ships as static local assets and makes no external runtime request.

## Simple-language policy

CrisisTrust may provide simple-language companion explanations for interface concepts, but it must not simplify or paraphrase authoritative emergency instructions in a way that hides the original wording.

Original instructions remain available verbatim.

## Human review

Accessibility and translation quality require human review in addition to automated tests.

High-value community review includes:

- screen-reader testing;
- keyboard-only testing;
- cognitive-load review;
- Portuguese and Spanish terminology review;
- humanitarian terminology review;
- low-vision testing;
- color-contrast review;
- mobile and low-bandwidth usability testing.

## Non-goals

v0.3 does not:

- automatically call an online translation service;
- send emergency text to a third party;
- infer a user's native language;
- persist accessibility preferences automatically;
- claim that machine translation is authoritative;
- hide the original source instruction;
- claim formal accessibility certification.

## Community invitation

Accessibility specialists, translators, localization engineers, CAP implementers, humanitarian technologists, UX researchers, assistive-technology users, QA engineers, and software developers are invited to review and improve this profile through Issues and Pull Requests.

Accepted contributions receive Git/PR/release attribution while original project authorship and ownership remain attributed to **Chris Cruz | h4ckd4d**.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
