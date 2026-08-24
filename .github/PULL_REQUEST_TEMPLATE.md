## Purpose

Describe the human-safety problem this change addresses.

## Safety and trust impact

- Does this change alert provenance, integrity, freshness, instructions, check-ins, or community resources?
- What uncertainty remains visible to the user?
- Does it alter any source instruction or safety-critical text?

## Privacy impact

- What data is collected?
- What data is retained?
- Does this add a network request, telemetry, storage, location processing, or third-party dependency?

## Accessibility impact

Describe keyboard, screen-reader, low-bandwidth, language, or cognitive-load considerations.

## Testing

List automated and manual tests added or updated.

## Checklist

- [ ] I preserved authoritative/source instructions without silently rewriting their meaning.
- [ ] I did not add hidden tracking, advertising, or unnecessary personal-data collection.
- [ ] I kept `unknown`, `stale`, and failed-integrity states visible where applicable.
- [ ] I added or updated tests for safety-sensitive behavior.
- [ ] I updated documentation for protocol or behavioral changes.
