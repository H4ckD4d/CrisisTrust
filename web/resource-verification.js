"use strict";

const resourceFixtures = [
  {
    record_type: "community-resource",
    protocol_version: "0.1",
    resource_id: "CT-RESOURCE-DEMO-001",
    resource_type: "cooling-center",
    name: "Example Community Cooling Center",
    area_description: "Example District — documentation fixture only",
    address: "100 Example Avenue, Example City",
    source: "Example Emergency Authority",
    verification_status: "verified",
    availability: "available"
  },
  {
    record_type: "community-resource",
    protocol_version: "0.1",
    resource_id: "CT-RESOURCE-DEMO-002",
    resource_type: "information-point",
    name: "Example Official Information Point",
    area_description: "Example District — documentation fixture only",
    source: "Example Emergency Authority",
    verification_status: "stale",
    availability: "unknown"
  }
];

const verificationFixtures = [
  {
    record_type: "resource-verification",
    protocol_version: "0.4",
    verification_id: "CT-RV-DEMO-001",
    resource_id: "CT-RESOURCE-DEMO-001",
    observed_at: "2026-08-23T18:05:00Z",
    verifier_role: "authority",
    source_class: "official-record",
    availability: "available",
    capacity: { status: "available", value: 120, unit: "people" },
    accessibility: { status: "confirmed", note: "Synthetic accessible entrance confirmation." },
    verification_result: "supports",
    evidence_reference: "synthetic-official-record-001"
  },
  {
    record_type: "resource-verification",
    protocol_version: "0.4",
    verification_id: "CT-RV-DEMO-002",
    resource_id: "CT-RESOURCE-DEMO-001",
    observed_at: "2026-08-23T18:12:00Z",
    verifier_role: "operator",
    source_class: "operator-confirmation",
    availability: "available",
    capacity: { status: "limited", value: 40, unit: "spaces remaining" },
    accessibility: { status: "confirmed", note: "Synthetic operator confirmation." },
    verification_result: "supports",
    evidence_reference: "synthetic-operator-confirmation-001"
  },
  {
    record_type: "resource-verification",
    protocol_version: "0.4",
    verification_id: "CT-RV-DEMO-003",
    resource_id: "CT-RESOURCE-DEMO-002",
    observed_at: "2026-08-23T12:00:00Z",
    verifier_role: "community-report",
    source_class: "community-report",
    availability: "available",
    capacity: { status: "limited", note: "Synthetic community report says the resource is operating." },
    accessibility: { status: "unknown" },
    verification_result: "supports"
  },
  {
    record_type: "resource-verification",
    protocol_version: "0.4",
    verification_id: "CT-RV-DEMO-004",
    resource_id: "CT-RESOURCE-DEMO-002",
    observed_at: "2026-08-23T12:05:00Z",
    verifier_role: "partner-organization",
    source_class: "partner-confirmation",
    availability: "unavailable",
    capacity: { status: "full" },
    accessibility: { status: "unknown" },
    verification_result: "contradicts",
    evidence_reference: "synthetic-partner-report-002"
  }
];

const messages = {
  en: {
    subtitle: "Community resources with visible source, freshness, capacity, and conflict history.",
    local: "Local session only",
    language: "Interface language",
    boundary: "CrisisTrust keeps source classes, timestamps, conflicts, availability, and capacity visible instead of collapsing them into a single trust badge.",
    resources: "Resources",
    verified: "Verified",
    conflicting: "Conflicting",
    review: "Stale / unavailable",
    safety: "Synthetic demonstration only. Do not treat fixture resources as real emergency services.",
    owner: "Original creator, project owner, and primary maintainer",
    invite: "Developers, humanitarian technologists, emergency-management practitioners, accessibility specialists, NGOs, civic-technology teams, QA engineers, and data-model contributors are invited to improve this verification model professionally.",
    availability: "Availability",
    capacity: "Capacity",
    accessibility: "Accessibility",
    lastObserved: "Last observed",
    reason: "Why this state",
    history: "Verification history",
    source: "Source class",
    verifier: "Verifier role",
    result: "Result"
  },
  "pt-BR": {
    subtitle: "Recursos comunitários com fonte, atualização, capacidade e histórico de conflitos visíveis.",
    local: "Somente sessão local",
    language: "Idioma da interface",
    boundary: "O CrisisTrust mantém classes de fonte, horários, conflitos, disponibilidade e capacidade visíveis em vez de reduzir tudo a um único selo de confiança.",
    resources: "Recursos",
    verified: "Verificados",
    conflicting: "Conflitantes",
    review: "Desatualizados / indisponíveis",
    safety: "Demonstração sintética. Não trate os recursos de teste como serviços reais de emergência.",
    owner: "Criador original, proprietário do projeto e mantenedor principal",
    invite: "Desenvolvedores, especialistas em tecnologia humanitária, gestão de emergências, acessibilidade, ONGs, tecnologia cívica, QA e modelagem de dados são convidados a melhorar profissionalmente este modelo de verificação.",
    availability: "Disponibilidade",
    capacity: "Capacidade",
    accessibility: "Acessibilidade",
    lastObserved: "Última observação",
    reason: "Motivo do estado",
    history: "Histórico de verificações",
    source: "Classe da fonte",
    verifier: "Função do verificador",
    result: "Resultado"
  },
  es: {
    subtitle: "Recursos comunitarios con fuente, vigencia, capacidad e historial de conflictos visibles.",
    local: "Solo sesión local",
    language: "Idioma de la interfaz",
    boundary: "CrisisTrust mantiene visibles las clases de fuente, tiempos, conflictos, disponibilidad y capacidad en lugar de reducir todo a una sola insignia de confianza.",
    resources: "Recursos",
    verified: "Verificados",
    conflicting: "En conflicto",
    review: "Desactualizados / no disponibles",
    safety: "Demostración sintética. No trate los recursos de prueba como servicios reales de emergencia.",
    owner: "Creador original, propietario del proyecto y mantenedor principal",
    invite: "Desarrolladores, especialistas en tecnología humanitaria, gestión de emergencias, accesibilidad, ONG, tecnología cívica, QA y modelado de datos están invitados a mejorar profesionalmente este modelo de verificación.",
    availability: "Disponibilidad",
    capacity: "Capacidad",
    accessibility: "Accesibilidad",
    lastObserved: "Última observación",
    reason: "Motivo del estado",
    history: "Historial de verificaciones",
    source: "Clase de fuente",
    verifier: "Rol del verificador",
    result: "Resultado"
  }
};

const grid = document.getElementById("verifiedResourceGrid");
const language = document.getElementById("resourceLanguage");
const demoNow = new Date("2026-08-23T18:30:00Z");

function text() {
  return messages[language.value] || messages.en;
}

function formatCapacity(capacity) {
  if (!capacity || capacity.status === "unknown") return "unknown";
  const amount = Number.isInteger(capacity.value) ? ` · ${capacity.value}` : "";
  const unit = capacity.unit ? ` ${capacity.unit}` : "";
  return `${capacity.status}${amount}${unit}`;
}

function renderSummary(states) {
  document.getElementById("summaryResources").textContent = String(states.length);
  document.getElementById("summaryVerified").textContent = String(states.filter((item) => item.state === "verified").length);
  document.getElementById("summaryConflicting").textContent = String(states.filter((item) => item.state === "conflicting").length);
  document.getElementById("summaryNeedsReview").textContent = String(states.filter((item) => ["stale", "unavailable", "unverified"].includes(item.state)).length);
}

function setStaticLanguage() {
  const t = text();
  document.documentElement.lang = language.value;
  document.getElementById("subtitle").textContent = t.subtitle;
  document.getElementById("localBadge").textContent = t.local;
  document.getElementById("languageLabel").textContent = t.language;
  document.getElementById("boundaryText").textContent = t.boundary;
  document.getElementById("summaryResourcesLabel").textContent = t.resources;
  document.getElementById("summaryVerifiedLabel").textContent = t.verified;
  document.getElementById("summaryConflictLabel").textContent = t.conflicting;
  document.getElementById("summaryStaleLabel").textContent = t.review;
  document.getElementById("safetyNote").textContent = t.safety;
  document.getElementById("ownerLabel").textContent = t.owner;
  document.getElementById("communityInvite").textContent = t.invite;
}

function render() {
  setStaticLanguage();
  const t = text();
  grid.textContent = "";
  const states = [];

  for (const resource of resourceFixtures) {
    const snapshot = CrisisTrustResourceVerification.latestOperationalSnapshot(resource, verificationFixtures, { now: demoNow, maxAgeMinutes: 120 });
    states.push(snapshot);
    const card = document.createElement("article");
    card.className = "resource-verified-card";

    const heading = document.createElement("h2");
    heading.textContent = resource.name;
    const state = document.createElement("span");
    state.className = `resource-state ${snapshot.state}`;
    state.textContent = snapshot.state;
    const area = document.createElement("p");
    area.className = "muted";
    area.textContent = resource.address ? `${resource.area_description} · ${resource.address}` : resource.area_description;

    const facts = document.createElement("dl");
    facts.className = "resource-facts";
    const factRows = [
      [t.availability, snapshot.availability],
      [t.capacity, formatCapacity(snapshot.capacity)],
      [t.accessibility, snapshot.accessibility.status || "unknown"],
      [t.lastObserved, snapshot.last_observed_at || "unknown"],
      [t.reason, snapshot.reason],
      ["support / conflict", `${snapshot.support_count} / ${snapshot.conflict_count}`]
    ];
    for (const [label, value] of factRows) {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      facts.appendChild(row);
    }

    const historyTitle = document.createElement("strong");
    historyTitle.textContent = t.history;
    const history = document.createElement("div");
    history.className = "verification-history";
    const entries = verificationFixtures
      .filter((item) => item.resource_id === resource.resource_id)
      .sort((a, b) => Date.parse(b.observed_at) - Date.parse(a.observed_at));

    for (const item of entries) {
      const entry = document.createElement("div");
      entry.className = `verification-entry ${item.verification_result}`;
      const first = document.createElement("p");
      first.textContent = `${item.observed_at} · ${t.result}: ${item.verification_result} · ${t.availability}: ${item.availability}`;
      const second = document.createElement("p");
      second.className = "muted";
      second.textContent = `${t.source}: ${item.source_class} · ${t.verifier}: ${item.verifier_role}`;
      entry.append(first, second);
      history.appendChild(entry);
    }

    card.append(heading, state, area, facts, historyTitle, history);
    grid.appendChild(card);
  }

  renderSummary(states);
}

language.addEventListener("change", render);
render();
