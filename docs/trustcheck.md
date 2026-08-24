# CrisisTrust TrustCheck v0.2

**Project owner:** Chris Cruz | h4ckd4d

## Purpose

TrustCheck is a privacy-first verification workflow for urgent claims involving a family member, trusted person, account-security warning, or urgent request.

The objective is not to prove identity from voice, caller ID, photographs, emotion, or AI inference. The objective is to slow down high-pressure decisions long enough to verify the claim through independent and pre-established channels.

## Core rule

> Urgency is not evidence. Familiarity is not authentication.

TrustCheck keeps these concepts separate:

```text
Claim received
      !=
Identity verified
      !=
Emergency confirmed
      !=
Requested action justified
```

## Verification states

| State | Meaning |
| --- | --- |
| `unreviewed` | No verification workflow has started. |
| `verifying` | Independent verification is in progress. |
| `verified-by-process` | The documented TrustCheck process obtained sufficient independent corroboration and no conflicting evidence. |
| `unresolved` | The available evidence is incomplete or insufficient. |
| `conflicting` | At least one material verification result contradicts the claim or another verification result. |
| `cancelled` | The user stopped the workflow without a verification conclusion. |

`verified-by-process` is deliberately narrower than a claim that identity or facts are mathematically certain.

## Verification sequence

```text
Urgent claim
    ↓
Do not act on urgency alone
    ↓
Initiate contact through a known independent channel
    ↓
Evaluate confirmation / denial / no response
    ↓
Check a prearranged challenge when available
    ↓
Ask a trusted-circle member for corroboration when appropriate
    ↓
Preserve conflicts instead of averaging them away
    ↓
verified-by-process / unresolved / conflicting
    ↓
User-controlled safe action
```

## Independent channel

An independent channel is one the user initiates using contact information already known before the urgent request.

Examples include:

- calling a previously saved number rather than returning the incoming call;
- using an already-established messaging conversation;
- contacting another trusted person who can independently confirm the situation;
- using an official account-security channel already known to the user.

The protocol stores only the channel category and result by default. It does not require the actual phone number, email address, username, or message content.

## Prearranged challenge

Families or trusted groups may choose a prearranged challenge or phrase outside the CrisisTrust application.

TrustCheck records only:

```text
was_prearranged = true | false
result = passed | failed | not-used
```

The secret itself must not be stored in the TrustCheck case record.

## Trusted Circle corroboration

Trusted Circle members may independently report:

- `confirmed`;
- `denied`;
- `unavailable`;
- `not-asked`.

A denial creates conflicting evidence and must remain visible.

## Decision logic

The v0.2 reference engine is intentionally conservative.

A case can become `verified-by-process` only when:

1. at least one independently initiated known/official channel confirms the claim; and
2. either a prearranged challenge passes or at least one Trusted Circle member independently confirms it; and
3. no independent channel, challenge, or Trusted Circle member produces a denial/failure.

Otherwise the result remains `unresolved`, unless contradictory evidence makes it `conflicting`.

## Weak signals that are not authentication

The following must not independently produce `verified-by-process`:

- familiar-sounding voice;
- caller ID;
- profile photograph;
- display name;
- urgency or emotional pressure;
- knowledge of public personal facts;
- an AI-generated identity score.

## Sensitive-action warning

Requests involving money transfers, secrets, recovery codes, travel, or account changes should be treated as high consequence. TrustCheck can display the requested action, but it does not automatically authorize it.

## Privacy boundary

The reference implementation does not require:

- precise location;
- biometric data;
- private-message contents;
- phone numbers or email addresses;
- passwords;
- recovery codes;
- payment details;
- voice recordings;
- face images.

## Human factors

TrustCheck is designed to reduce decision pressure. Interface language should avoid shame or blame and should make `unresolved` an acceptable outcome when evidence is incomplete.

## Non-goals

TrustCheck is not:

- a biometric identity-verification system;
- a voice-clone detector;
- a fraud guarantee;
- a law-enforcement attribution tool;
- a payment authorization system;
- a replacement for emergency services.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
