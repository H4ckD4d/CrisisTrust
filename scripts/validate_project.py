#!/usr/bin/env python3
"""Static validation for CrisisTrust.

No network access is performed.
"""

from __future__ import annotations

import html as html_lib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "README.md", "ROADMAP.md", "CONTRIBUTING.md", "DEVELOPERS.md", "SECURITY.md", "CHANGELOG.md", "LICENSE",
    "docs/architecture.md", "docs/trust-model.md", "docs/protocol.md", "docs/cap-interop.md", "docs/threat-model.md",
    "docs/trustcheck.md", "docs/accessibility-multilingual.md", "docs/community-resource-verification.md",
    "schemas/alert-envelope.schema.json", "schemas/action-card.schema.json", "schemas/checkin.schema.json",
    "schemas/community-resource.schema.json", "schemas/trustcheck-case.schema.json", "schemas/translation-record.schema.json",
    "schemas/resource-verification.schema.json",
    "examples/alert.synthetic.json", "examples/checkins.synthetic.json", "examples/resources.synthetic.json",
    "examples/trustcheck.synthetic.json", "examples/translation.pt-BR.synthetic.json", "examples/translation.es.synthetic.json",
    "examples/resource-verifications.synthetic.json",
    "web/index.html", "web/resources.html", "web/styles.css", "web/core.js", "web/app.js",
    "web/trustcheck.css", "web/trustcheck-core.js", "web/trustcheck.js", "web/i18n.js",
    "web/accessibility.js", "web/accessibility.css", "web/translation-core.js", "web/translation.js",
    "web/resource-verification-core.js", "web/resource-verification.js", "web/resource-verification.css",
    "scripts/test_core.js", "scripts/test_trustcheck.js", "scripts/test_accessibility_i18n.js",
    "scripts/test_resource_verification.js", "scripts/serve_local.py",
]

FORBIDDEN_WEB_TOKENS = [
    "fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon", "localStorage", "sessionStorage", "document.cookie",
    "navigator.geolocation", "getCurrentPosition(", "watchPosition(",
]

FORBIDDEN_PERSON_TRACKING_KEYS = {"latitude", "longitude", "coordinates", "device_id", "advertising_id", "location_history"}
FORBIDDEN_TRUSTCHECK_KEYS = {
    "phone_number", "email_address", "password", "recovery_code", "payment_card", "bank_account", "secret_value",
    "challenge_secret", "voice_recording", "face_image", "latitude", "longitude", "coordinates",
}
TRANSLATION_STATUSES = {"source-provided", "human-reviewed", "machine-assisted-unreviewed", "translator-declared", "unverified"}
RESOURCE_ROLES = {"authority", "operator", "partner-organization", "trained-community-verifier", "community-report", "unknown"}
RESOURCE_SOURCES = {"official-record", "operator-confirmation", "partner-confirmation", "direct-observation", "community-report", "unknown"}
RESOURCE_RESULTS = {"supports", "contradicts", "inconclusive"}
RESOURCE_AVAILABILITY = {"available", "limited", "unavailable", "unknown"}
LANGUAGE_TAG = re.compile(r"^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$")


def walk_keys(value):
    if isinstance(value, dict):
        for key, item in value.items():
            yield key
            yield from walk_keys(item)
    elif isinstance(value, list):
        for item in value:
            yield from walk_keys(item)


def load_json(path: Path, errors: list[str]):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"invalid JSON {path.relative_to(ROOT)}: {exc}")
        return None


def validate_translation(record, alert, filename, errors):
    if not isinstance(record, dict):
        errors.append(f"{filename} must contain an object")
        return
    if record.get("record_type") != "translation-record" or record.get("protocol_version") != "0.3":
        errors.append(f"{filename} must be a v0.3 translation-record")
    if record.get("translation_status") not in TRANSLATION_STATUSES:
        errors.append(f"{filename} has invalid translation_status")
    for field in ("source_language", "target_language"):
        value = record.get(field, "")
        if not isinstance(value, str) or not LANGUAGE_TAG.fullmatch(value):
            errors.append(f"{filename} has invalid {field}")
    if record.get("source_language", "").lower() == record.get("target_language", "").lower():
        errors.append(f"{filename} source and target languages must differ")
    if isinstance(alert, dict):
        if record.get("subject_id") != alert.get("alert_id"):
            errors.append(f"{filename} subject_id must match synthetic alert")
        field = record.get("field")
        if field not in {"event", "description", "instruction", "area_description"}:
            errors.append(f"{filename} references unsupported field")
        elif record.get("source_text") != alert.get(field):
            errors.append(f"{filename} source_text must exactly match the synthetic source field")


def validate_resource_verifications(records, resource_ids, errors):
    if not isinstance(records, list) or not records:
        errors.append("resource-verifications.synthetic.json must contain a non-empty list")
        return
    seen = set()
    community_support_only = []
    for index, item in enumerate(records, start=1):
        prefix = f"resource verification #{index}"
        if not isinstance(item, dict):
            errors.append(f"{prefix} must be an object")
            continue
        if item.get("record_type") != "resource-verification" or item.get("protocol_version") != "0.4":
            errors.append(f"{prefix} must be a v0.4 resource-verification")
        verification_id = item.get("verification_id")
        if not isinstance(verification_id, str) or not verification_id:
            errors.append(f"{prefix} missing verification_id")
        elif verification_id in seen:
            errors.append(f"duplicate resource verification id: {verification_id}")
        seen.add(verification_id)
        if item.get("resource_id") not in resource_ids:
            errors.append(f"{prefix} references unknown resource_id")
        if item.get("verifier_role") not in RESOURCE_ROLES:
            errors.append(f"{prefix} has invalid verifier_role")
        if item.get("source_class") not in RESOURCE_SOURCES:
            errors.append(f"{prefix} has invalid source_class")
        if item.get("availability") not in RESOURCE_AVAILABILITY:
            errors.append(f"{prefix} has invalid availability")
        if item.get("verification_result") not in RESOURCE_RESULTS:
            errors.append(f"{prefix} has invalid verification_result")
        if not isinstance(item.get("observed_at"), str):
            errors.append(f"{prefix} missing observed_at")
        forbidden = sorted(set(walk_keys(item)) & FORBIDDEN_PERSON_TRACKING_KEYS)
        if forbidden:
            errors.append(f"{prefix} contains forbidden personal-tracking keys: {forbidden}")
        if item.get("source_class") == "community-report" and item.get("verification_result") == "supports":
            community_support_only.append(item)

    if community_support_only and "single community report" not in (ROOT / "docs/community-resource-verification.md").read_text(encoding="utf-8").lower():
        errors.append("resource verification policy must explicitly document the single-community-report boundary")


def validate_html(path: Path, errors: list[str]):
    text = path.read_text(encoding="utf-8")
    for token in FORBIDDEN_WEB_TOKENS:
        if token in text:
            errors.append(f"{path.relative_to(ROOT)} contains forbidden network/persistence token: {token}")
    if re.search(r"\son[a-zA-Z]+\s*=", text):
        errors.append(f"{path.relative_to(ROOT)} contains inline event handlers")
    if re.search(r'<(?:script|link)[^>]+(?:src|href)=["\']https?://', text, re.IGNORECASE):
        errors.append(f"{path.relative_to(ROOT)} must not depend on external runtime scripts or stylesheets")
    ids = re.findall(r'\bid="([^"]+)"', text)
    duplicates = sorted({item for item in ids if ids.count(item) > 1})
    if duplicates:
        errors.append(f"{path.relative_to(ROOT)} contains duplicate ids: {duplicates}")
    return text


def main() -> int:
    errors: list[str] = []

    for relative in REQUIRED:
        if not (ROOT / relative).is_file():
            errors.append(f"missing required file: {relative}")

    json_files = list((ROOT / "schemas").glob("*.json")) + list((ROOT / "examples").glob("*.json"))
    loaded = {path.name: load_json(path, errors) for path in json_files}

    alert = loaded.get("alert.synthetic.json")
    if isinstance(alert, dict):
        if alert.get("record_type") != "alert-envelope" or alert.get("protocol_version") != "0.1":
            errors.append("synthetic alert must be a v0.1 alert-envelope")
        forbidden = sorted(set(walk_keys(alert)) & FORBIDDEN_PERSON_TRACKING_KEYS)
        if forbidden:
            errors.append(f"synthetic alert contains forbidden personal-tracking keys: {forbidden}")

    checkins = loaded.get("checkins.synthetic.json")
    if isinstance(checkins, list):
        for index, item in enumerate(checkins, start=1):
            if not isinstance(item, dict) or item.get("status") not in {"safe", "need-assistance", "unknown"}:
                errors.append(f"check-in fixture #{index} has invalid status")
            elif set(walk_keys(item)) & FORBIDDEN_PERSON_TRACKING_KEYS:
                errors.append(f"check-in fixture #{index} contains personal-tracking keys")

    trustcheck = loaded.get("trustcheck.synthetic.json")
    if isinstance(trustcheck, dict):
        if trustcheck.get("record_type") != "trustcheck-case" or trustcheck.get("protocol_version") != "0.2":
            errors.append("synthetic TrustCheck fixture must be a v0.2 trustcheck-case")
        forbidden = sorted(set(walk_keys(trustcheck)) & FORBIDDEN_TRUSTCHECK_KEYS)
        if forbidden:
            errors.append(f"synthetic TrustCheck fixture contains forbidden sensitive keys: {forbidden}")

    for filename in ("translation.pt-BR.synthetic.json", "translation.es.synthetic.json"):
        validate_translation(loaded.get(filename), alert, filename, errors)

    resources = loaded.get("resources.synthetic.json")
    resource_ids = {item.get("resource_id") for item in resources if isinstance(item, dict)} if isinstance(resources, list) else set()
    validate_resource_verifications(loaded.get("resource-verifications.synthetic.json"), resource_ids, errors)

    index_html = validate_html(ROOT / "web/index.html", errors)
    resources_html = validate_html(ROOT / "web/resources.html", errors)
    html_visible = html_lib.unescape(index_html)
    for required_text in [
        "Provenance is not a truth oracle", "Local session only", "Chris Cruz | h4ckd4d", "Trusted Circle",
        "Community resources", "TrustCheck v0.2", "Urgency is not evidence", "verified-by-process",
        "Accessibility & language", "Original + companion translation", "translation-record", "WCAG 2.2",
    ]:
        if required_text.lower() not in html_visible.lower():
            errors.append(f"web/index.html missing required safety/accessibility/branding text: {required_text}")

    resource_visible = html_lib.unescape(resources_html)
    for required_text in ["Community Resource Verification", "A report is not automatically a verified resource", "Chris Cruz | h4ckd4d", "Local session only"]:
        if required_text.lower() not in resource_visible.lower():
            errors.append(f"web/resources.html missing required v0.4 text: {required_text}")

    for path in sorted((ROOT / "web").glob("*.js")):
        text = path.read_text(encoding="utf-8")
        for token in FORBIDDEN_WEB_TOKENS:
            if token in text:
                errors.append(f"web/{path.name} contains forbidden network/persistence token: {token}")

    accessibility_css = (ROOT / "web/accessibility.css").read_text(encoding="utf-8")
    for token in [":focus-visible", "prefers-reduced-motion", "access-high-contrast", "access-large-text", "access-low-bandwidth"]:
        if token not in accessibility_css:
            errors.append(f"web/accessibility.css missing accessibility control: {token}")

    resource_core = (ROOT / "web/resource-verification-core.js").read_text(encoding="utf-8")
    for token in ["conflicting", "stale", "unavailable", "community-report", "strongSources"]:
        if token not in resource_core:
            errors.append(f"resource verification engine missing required policy token: {token}")

    server_text = (ROOT / "scripts/serve_local.py").read_text(encoding="utf-8")
    if 'HOST = "127.0.0.1"' not in server_text:
        errors.append("local reference server must bind to 127.0.0.1 by default")

    if errors:
        print("CrisisTrust validation failed:\n")
        for error in errors:
            print(f"- {error}")
        return 1

    print("CrisisTrust project validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
