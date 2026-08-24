"use strict";

const claimType = document.getElementById("trustClaimType");
const requestedAction = document.getElementById("trustRequestedAction");
const independentResult = document.getElementById("trustIndependentResult");
const challengeResult = document.getElementById("trustChallengeResult");
const circleResult = document.getElementById("trustCircleResult");
const evaluateButton = document.getElementById("trustEvaluate");
const trustResult = document.getElementById("trustCheckResult");
const trustReason = document.getElementById("trustCheckReason");
const trustConsequence = document.getElementById("trustCheckConsequence");

const trustPresentation = Object.freeze({
  en: Object.freeze({
    states: { "verified-by-process": "verified-by-process", unresolved: "unresolved", conflicting: "conflicting", cancelled: "cancelled" },
    reasons: {
      "verified-by-process": "Independent confirmation plus a second trusted corroboration completed the TrustCheck process.",
      conflicting: "At least one independent verification result contradicts the claim.",
      "unresolved-confirmed": "Independent confirmation exists, but a second trusted corroboration is still missing.",
      "unresolved-unconfirmed": "No independently initiated channel has confirmed the claim.",
      cancelled: "Verification was cancelled by the user."
    },
    consequences: {
      none: "No high-consequence action declared",
      "call-back": "Call-back requested",
      "transfer-money": "Money transfer requested — verify independently before acting",
      "share-secret": "Secret or code requested — do not disclose based on urgency alone",
      travel: "Travel requested — independently verify the situation first",
      other: "Other requested action — verify independently before acting"
    },
    options: {
      "family-emergency": "Family emergency", "urgent-financial-request": "Urgent financial request", "account-security-warning": "Account-security warning", other: "Other",
      none: "None", "call-back": "Call back", "transfer-money": "Transfer money", "share-secret": "Share a secret or code", travel: "Travel",
      "not-checked": "Not checked", confirmed: "Confirmed", denied: "Denied", "no-response": "No response",
      "not-used": "Not used", passed: "Passed", failed: "Failed", "not-asked": "Not asked", unavailable: "Unavailable"
    }
  }),
  "pt-BR": Object.freeze({
    states: { "verified-by-process": "verificado pelo processo", unresolved: "não resolvido", conflicting: "conflitante", cancelled: "cancelado" },
    reasons: {
      "verified-by-process": "Uma confirmação independente e uma segunda corroboração confiável concluíram o processo TrustCheck.",
      conflicting: "Pelo menos um resultado de verificação independente contradiz a alegação.",
      "unresolved-confirmed": "Existe confirmação independente, mas ainda falta uma segunda corroboração confiável.",
      "unresolved-unconfirmed": "Nenhum canal iniciado de forma independente confirmou a alegação.",
      cancelled: "A verificação foi cancelada pelo usuário."
    },
    consequences: {
      none: "Nenhuma ação de alta consequência declarada",
      "call-back": "Retorno de chamada solicitado",
      "transfer-money": "Transferência de dinheiro solicitada — verifique de forma independente antes de agir",
      "share-secret": "Código ou segredo solicitado — não divulgue apenas por causa da urgência",
      travel: "Deslocamento solicitado — verifique a situação de forma independente primeiro",
      other: "Outra ação solicitada — verifique de forma independente antes de agir"
    },
    options: {
      "family-emergency": "Emergência familiar", "urgent-financial-request": "Pedido financeiro urgente", "account-security-warning": "Alerta de segurança de conta", other: "Outro",
      none: "Nenhuma", "call-back": "Retornar chamada", "transfer-money": "Transferir dinheiro", "share-secret": "Compartilhar código ou segredo", travel: "Deslocar-se",
      "not-checked": "Não verificado", confirmed: "Confirmado", denied: "Negado", "no-response": "Sem resposta",
      "not-used": "Não utilizado", passed: "Aprovado", failed: "Falhou", "not-asked": "Não consultado", unavailable: "Indisponível"
    }
  }),
  es: Object.freeze({
    states: { "verified-by-process": "verificado por el proceso", unresolved: "no resuelto", conflicting: "conflictivo", cancelled: "cancelado" },
    reasons: {
      "verified-by-process": "Una confirmación independiente y una segunda corroboración confiable completaron el proceso TrustCheck.",
      conflicting: "Al menos un resultado de verificación independiente contradice la afirmación.",
      "unresolved-confirmed": "Existe confirmación independiente, pero todavía falta una segunda corroboración confiable.",
      "unresolved-unconfirmed": "Ningún canal iniciado de forma independiente confirmó la afirmación.",
      cancelled: "La verificación fue cancelada por el usuario."
    },
    consequences: {
      none: "No se declaró ninguna acción de alta consecuencia",
      "call-back": "Se solicitó devolver la llamada",
      "transfer-money": "Se solicitó transferir dinero — verifique de forma independiente antes de actuar",
      "share-secret": "Se solicitó un código o secreto — no lo revele solo por la urgencia",
      travel: "Se solicitó desplazamiento — verifique la situación de forma independiente primero",
      other: "Otra acción solicitada — verifique de forma independiente antes de actuar"
    },
    options: {
      "family-emergency": "Emergencia familiar", "urgent-financial-request": "Solicitud financiera urgente", "account-security-warning": "Alerta de seguridad de cuenta", other: "Otro",
      none: "Ninguna", "call-back": "Devolver llamada", "transfer-money": "Transferir dinero", "share-secret": "Compartir código o secreto", travel: "Desplazarse",
      "not-checked": "No verificado", confirmed: "Confirmado", denied: "Negado", "no-response": "Sin respuesta",
      "not-used": "No utilizado", passed: "Aprobado", failed: "Falló", "not-asked": "No consultado", unavailable: "No disponible"
    }
  })
});

function currentPresentation() {
  const language = window.CrisisTrustI18n ? CrisisTrustI18n.currentLanguage() : "en";
  return trustPresentation[language] || trustPresentation.en;
}

function buildSessionCase() {
  const challengeValue = challengeResult.value;
  const circleValue = circleResult.value;
  return {
    record_type: "trustcheck-case",
    protocol_version: "0.2",
    case_id: "CT-SESSION-TRUSTCHECK",
    claim_type: claimType.value,
    received_at: new Date().toISOString(),
    requested_action: requestedAction.value,
    verification_state: "verifying",
    channels: [{ channel_id: "independent-session-channel", channel_type: "known-phone", independently_initiated: true, result: independentResult.value }],
    challenge: { was_prearranged: challengeValue !== "not-used", result: challengeValue },
    trusted_circle: circleValue === "not-asked" ? [] : [{ alias: "Trusted contact", result: circleValue }]
  };
}

function localizedReason(result, item) {
  const messages = currentPresentation().reasons;
  if (result.state === "verified-by-process" || result.state === "conflicting" || result.state === "cancelled") return messages[result.state];
  const independentConfirmed = item.channels.some((channel) => channel.independently_initiated && channel.result === "confirmed");
  return independentConfirmed ? messages["unresolved-confirmed"] : messages["unresolved-unconfirmed"];
}

function renderResult(result, item) {
  const presentation = currentPresentation();
  trustResult.textContent = presentation.states[result.state] || result.state;
  trustResult.className = `trustcheck-result ${result.state}`;
  trustReason.textContent = localizedReason(result, item);
  trustConsequence.textContent = presentation.consequences[item.requested_action] || presentation.consequences.other;
}

function localizeOptions() {
  const options = currentPresentation().options;
  [claimType, requestedAction, independentResult, challengeResult, circleResult].forEach((select) => {
    [...select.options].forEach((option) => {
      option.textContent = options[option.value] || option.textContent;
    });
  });
}

evaluateButton.addEventListener("click", () => {
  const item = buildSessionCase();
  const errors = CrisisTrustTrustCheck.validateCase(item);
  if (errors.length) {
    renderResult({ state: "unresolved" }, item);
    return;
  }
  renderResult(CrisisTrustTrustCheck.evaluateCase(item), item);
});

document.addEventListener("crisistrust-languagechange", localizeOptions);
localizeOptions();
