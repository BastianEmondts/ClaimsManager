# ClaimsManager

## Claim Manager AI-Assistent (Mock)

Dieses Repository enthält eine rein statische Web-Anwendung (GitHub-Pages-fähig) zur Simulation einer KI-unterstützten Claimprüfung im Contract & Claim Management.

### Funktionsumfang (Mock)

- Simulation der Dokumentaufnahme (Dummy-Dokumente statt echtem Upload)
- Strukturierte Claimerfassung (Bezeichnung, Betrag, Begründung, Vertragsreferenz)
- Simulierte KI-Analyse mit:
  - Abgleich Claim ↔ Vertrag (dem Grunde nach)
  - Plausibilitätsprüfung der Höhe
  - Risiko-Abgleich
  - Terminfolgen-Prüfung
- Ergebnis-Dashboard mit Empfehlung (Annahme, Ablehnung, Verhandlung)
- Generierung von Mock-Textentwürfen:
  - Verhandlungsvorbereitung
  - Ablehnungsschreiben
  - Annahmeschreiben

### Technischer Hinweis

Die KI-Logik ist in `docs/aiMock.js` gekapselt. Die Stellen für eine spätere echte KI-Anbindung sind mit `TODO: Integrate Azure OpenAI here` markiert.
