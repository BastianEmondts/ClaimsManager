import {
  analyzeClaimWithAI,
  generateAcceptanceDraft,
  generateNegotiationDraft,
  generateRejectionDraft,
} from "./aiMock.js";

const form = document.getElementById("claim-form");
const analyzeButton = document.getElementById("analyze-btn");
const dashboard = document.getElementById("result-dashboard");
const draftOutput = document.getElementById("draft-output");

let latestClaim = null;
let latestAnalysis = null;

function selectedDocuments() {
  return Array.from(document.querySelectorAll("input[name='docs']:checked")).map((item) => item.value);
}

function readFormInput() {
  return {
    name: document.getElementById("claim-name").value.trim(),
    amount: document.getElementById("claim-amount").value,
    justification: document.getElementById("claim-justification").value.trim(),
    contractReference: document.getElementById("contract-reference").value.trim(),
    documents: selectedDocuments(),
  };
}

function isValidClaimInput(claimInput) {
  return (
    claimInput.name.length > 2 &&
    Number(claimInput.amount) > 0 &&
    claimInput.justification.length > 5 &&
    claimInput.contractReference.length > 2
  );
}

function renderRiskList(risks) {
  return risks
    .map((risk) => `<li><strong>${risk.id}</strong>: ${risk.title} <em>(Stufe: ${risk.level})</em></li>`)
    .join("");
}

function renderDashboard(analysis) {
  document.getElementById("ground-rating").textContent = analysis.groundAssessment.rating;
  document.getElementById("ground-details").textContent = `${analysis.groundAssessment.clause} | Einstufung: ${analysis.groundAssessment.scopeClassification}`;
  document.getElementById("amount-rating").textContent = analysis.amountAssessment.rating;
  document.getElementById("amount-details").textContent = `${analysis.amountAssessment.referenceValue} | Markt: ${analysis.amountAssessment.marketRange}`;
  document.getElementById("schedule-impact").textContent = analysis.scheduleImpact;
  document.getElementById("recommendation").textContent = analysis.recommendation;
  document.getElementById("risk-list").innerHTML = renderRiskList(analysis.risks);
  dashboard.hidden = false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const claimInput = readFormInput();
  if (!isValidClaimInput(claimInput)) {
    alert("Bitte alle Pflichtfelder für den Claim vollständig ausfüllen.");
    return;
  }

  latestClaim = claimInput;
  latestAnalysis = analyzeClaimWithAI(claimInput);
  renderDashboard(latestAnalysis);
  draftOutput.value = "Analyse abgeschlossen. Wählen Sie eine Aktion zur Textgenerierung.";
});

analyzeButton.addEventListener("click", () => {
  form.requestSubmit();
});

document.getElementById("draft-negotiation").addEventListener("click", () => {
  if (!latestClaim || !latestAnalysis) return;
  draftOutput.value = generateNegotiationDraft(latestClaim, latestAnalysis);
});

document.getElementById("draft-rejection").addEventListener("click", () => {
  if (!latestClaim || !latestAnalysis) return;
  draftOutput.value = generateRejectionDraft(latestClaim, latestAnalysis);
});

document.getElementById("draft-acceptance").addEventListener("click", () => {
  if (!latestClaim || !latestAnalysis) return;
  draftOutput.value = generateAcceptanceDraft(latestClaim, latestAnalysis);
});
