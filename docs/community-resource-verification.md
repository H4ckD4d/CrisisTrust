# Community Resource Verification

**CrisisTrust Protocol profile:** v0.4  
**Project owner:** Chris Cruz | h4ckd4d

## Purpose

During a crisis, a resource can be legitimate and still become full, unavailable, relocated, inaccessible, or outdated within minutes. CrisisTrust v0.4 therefore separates the **resource record** from the **verification history** used to describe its current operational state.

```text
Community Resource
        ↓
Verification Records
        ↓
Source + Timestamp + Result
        ↓
Conflict Preservation
        ↓
Derived Operational State
```

## Core rule

> A report is not automatically a verified resource.

A single community report can be useful evidence, but it does not independently promote a resource to `verified`.

## Record separation

`community-resource` describes the resource identity and stable descriptive fields.

`resource-verification` records a time-bound observation about that resource.

This prevents later operational changes from rewriting the original resource record.

## Verification record

A v0.4 verification records:

- verification ID;
- resource ID;
- observation timestamp;
- verifier role;
- source class;
- current availability;
- optional capacity state;
- optional accessibility state;
- whether the observation supports, contradicts, or is inconclusive;
- optional evidence reference;
- a short operational note.

It must not require personal victim data or precise tracking of people.

## Verifier roles

- `authority`
- `operator`
- `partner-organization`
- `trained-community-verifier`
- `community-report`
- `unknown`

The role describes who is making the observation. It does not automatically guarantee correctness.

## Source classes

- `official-record`
- `operator-confirmation`
- `partner-confirmation`
- `direct-observation`
- `community-report`
- `unknown`

Source class and verifier role remain separate so implementations can explain why a state was derived.

## Derived states

The reference engine produces these operational states:

### `verified`

Current evidence supports the resource and either:

- a current authority/operator/partner source supports the state; or
- at least two distinct current source classes support it.

No current material conflict may be hidden.

### `unverified`

Information exists but does not meet the corroboration threshold.

A single community report normally remains here.

### `conflicting`

Current records materially disagree.

Conflict must remain visible until reconciled. The engine must not average contradictory observations into a reassuring result.

### `stale`

All known verification records are outside the configured freshness window.

A stale resource may still exist, but the current operational state is not sufficiently recent.

### `unavailable`

A current strong-source verification reports the resource unavailable and there is no current supporting record showing it available.

## Freshness

The reference implementation uses a configurable freshness window. The synthetic v0.4 console uses 120 minutes for deterministic testing.

Production deployments should select freshness windows by resource type and operational context. For example, capacity at a shelter may need shorter freshness than a permanent information office address.

## Capacity

Capacity is deliberately modeled as operational metadata, not a guarantee.

Possible capacity states:

- `available`
- `limited`
- `full`
- `unknown`

An optional integer and unit may be included when a source provides them.

Example:

```json
{
  "status": "limited",
  "value": 40,
  "unit": "spaces remaining"
}
```

## Accessibility

Accessibility information also has freshness and provenance concerns.

The v0.4 record supports:

- `confirmed`
- `partial`
- `unknown`

with a short note.

A resource must not be described as accessible merely because accessibility data is absent.

## Conflict policy

Conflicting current evidence is safety-relevant information.

CrisisTrust does not silently choose the more optimistic record.

```text
Source A: available
Source B: unavailable
        ↓
CONFLICTING
        ↓
Needs reconciliation / fresher evidence
```

## Community reports

Community reports are valuable for discovering change quickly. They are not discarded.

However:

```text
one community report
        ≠
verified resource
```

They can contribute to corroboration when combined with independent evidence.

## Privacy boundary

Resource verification describes **public support resources**, not individual movement.

The reference profile does not require:

- victim names;
- phone numbers;
- device IDs;
- advertising IDs;
- continuous location history;
- private messages;
- biometric data.

## Synthetic reference console

The repository includes:

```text
web/resources.html
web/resource-verification-core.js
web/resource-verification.js
examples/resource-verifications.synthetic.json
```

The console uses synthetic resource data only and performs no network requests.

## Human review

Derived state supports decision-making; it does not replace operators, authorities, humanitarian organizations, or emergency-management professionals.

Implementations should expose the verification history so a human can understand why a state exists.

---

**Chris Cruz | h4ckd4d** — Original creator, project owner, and primary maintainer.
