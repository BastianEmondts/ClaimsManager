// Claim Manager KI-Simulation
// TODO: Integrate Azure OpenAI here (replace mock logic with real AI calls)

const CONTRACT_KEYWORDS = {
  beton: { clause: "§4.2 Leistungsumfang – Betonarbeiten", type: "besondere Leistung" },
  entwaesserung: { clause: "§5.1 Nebenleistungen – Entwässerung", type: "Nebenleistung" },
  kabel: { clause: "§6.3 Zusatzleistungen – Kabeltrasse", type: "besondere Leistung" },
};

const RISK_REGISTER = [
  { id: "R-12", title: "Terminverzug Genehmigungen", level: "hoch" },
  { id: "R-21", title: "Rohstoffpreisschwankungen", level: "mittel" },
  { id: "R-33", title: "Schnittstellenrisiko Nachunternehmer", level: "mittel" },
];

const MARKET_PRICE_RANGES = {
  beton: [90, 130],
  entwaesserung: [35, 55],
  kabel: [22, 40],
  generic: [40, 85],
};

function detectCategory(input) {
  const normalized = input.toLowerCase();
  if (normalized.includes("beton")) return "beton";
  if (normalized.includes("entwässer") || normalized.includes("entwaesser")) return "entwaesserung";
  if (normalized.includes("kabel")) return "kabel";
  return "generic";
}

function buildGroundAssessment(category, amount) {
  // Prüfe, ob Leistung Teil des Vertrags ist
  const contractInfo = CONTRACT_KEYWORDS[category] || {
    clause: "§3.1 Allgemeine Leistungspflichten",
    type: "unklar (manuelle Prüfung empfohlen)",
  };

  const isLikelyJustified = contractInfo.type === "besondere Leistung" || amount > 60000;

  return {
    rating: isLikelyJustified
      ? "Anspruch dem Grunde nach voraussichtlich gerechtfertigt"
      : "Anspruch dem Grunde nach eher nicht gerechtfertigt",
    clause: contractInfo.clause,
    scopeClassification: contractInfo.type,
  };
}

function buildAmountAssessment(category, amount) {
  // Plausibilisierung der geforderten Höhe gegen simulierte Preisdaten
  const range = MARKET_PRICE_RANGES[category] || MARKET_PRICE_RANGES.generic;
  const referenceUnitValue = amount / 1000;
  let rating = "Forderungsbetrag erscheint plausibel";
  if (referenceUnitValue < range[0] * 0.8 || referenceUnitValue > range[1] * 1.2) {
    rating = "Forderungsbetrag erscheint unplausibel";
  }

  return {
    rating,
    marketRange: `${range[0]}–${range[1]} EUR/Einheit (simuliert)`,
    referenceValue: `${referenceUnitValue.toFixed(1)} EUR/Einheit (simuliert)`,
  };
}

function selectRisks(category) {
  // Risiko-Abgleich mit simuliertem Register
  if (category === "beton") return [RISK_REGISTER[0], RISK_REGISTER[1]];
  if (category === "kabel") return [RISK_REGISTER[2], RISK_REGISTER[1]];
  return [RISK_REGISTER[1]];
}

function buildScheduleImpact(amount, risks) {
  const days = Math.min(45, Math.max(5, Math.round(amount / 5000)));
  return `Mögliche Terminfolge: Verzögerung relevanter Meilensteine um ca. ${days} Kalendertage. Primäre Treiber: ${risks
    .map((risk) => risk.title)
    .join(", ")}.`;
}

function buildRecommendation(ground, amount, riskList) {
  const highRisk = riskList.some((risk) => risk.level === "hoch");

  if (ground.rating.includes("nicht gerechtfertigt")) {
    return "Empfehlung: Ablehnung mit Verweis auf vertraglich geschuldete Nebenleistung.";
  }

  if (amount.rating.includes("unplausibel")) {
    return "Empfehlung: Verhandlung empfohlen, da die geforderte Höhe über simulierten Vergleichswerten liegt.";
  }

  if (highRisk) {
    return "Empfehlung: Teilannahme mit Termin- und Risikokonditionen in Verhandlung absichern.";
  }

  return "Empfehlung: Annahme möglich, vorbehaltlich finaler juristischer und technischer Detailprüfung.";
}

export function analyzeClaimWithAI(claimInput) {
  // TODO: Integrate Azure OpenAI here (structured prompt + retrieval over contract docs)
  const category = detectCategory(`${claimInput.name} ${claimInput.justification}`);
  const amount = Number(claimInput.amount) || 0;

  const groundAssessment = buildGroundAssessment(category, amount);
  const amountAssessment = buildAmountAssessment(category, amount);
  const risks = selectRisks(category);
  const scheduleImpact = buildScheduleImpact(amount, risks);
  const recommendation = buildRecommendation(groundAssessment, amountAssessment, risks);

  return {
    groundAssessment,
    amountAssessment,
    risks,
    scheduleImpact,
    recommendation,
  };
}

export function generateNegotiationDraft(claimInput, analysis) {
  // TODO: Integrate Azure OpenAI here (negotiation strategy draft generation)
  return `Verhandlungsvorbereitung (Mock):\n- Ziel: Reduktion der Forderung \"${claimInput.name}\" auf belastbare Mengen/Preise.\n- Argument 1: Vertragsbezug ${analysis.groundAssessment.clause}.\n- Argument 2: Preisvergleich ${analysis.amountAssessment.marketRange}.\n- Argument 3: Termin-/Risikofolgen: ${analysis.scheduleImpact}`;
}

export function generateRejectionDraft(claimInput, analysis) {
  // TODO: Integrate Azure OpenAI here (formal rejection letter generation)
  return `Ablehnungsschreiben (Entwurf, Mock):\nSehr geehrte Damen und Herren,\n\nnach Prüfung Ihres Claims \"${claimInput.name}\" kommen wir derzeit zu dem Ergebnis, dass kein zusätzlicher Vergütungsanspruch besteht. Grundlage ist insbesondere ${analysis.groundAssessment.clause} (${analysis.groundAssessment.scopeClassification}).\n\nMit freundlichen Grüßen\nClaim Management`;
}

export function generateAcceptanceDraft(claimInput, analysis) {
  // TODO: Integrate Azure OpenAI here (formal acceptance letter generation)
  return `Annahmeschreiben (Entwurf, Mock):\nSehr geehrte Damen und Herren,\n\nwir bestätigen den Claim \"${claimInput.name}\" dem Grunde nach. Die Anerkennung erfolgt vorbehaltlich finaler Mengenprüfung und unter Berücksichtigung folgender Empfehlung: ${analysis.recommendation}\n\nMit freundlichen Grüßen\nClaim Management`;
}
