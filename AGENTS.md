# AGENTS.md

## Geltungsbereich

Diese Regeln gelten für das gesamte Repository sghnms_analytics. Es ist ein öffentliches, statisches GitHub-Pages-Frontend ohne Build-Schritt. Datenhoheit, Import und fachliche Berechnungen liegen im Repository sghnms_handball_data.

## Vor Änderungen lesen

Vor einer Änderung mindestens prüfen:

- README.md
- index.html
- app.js
- styles.css
- .github/workflows/deploy-pages.yml
- die betroffenen Verträge unter data/

Bei fachlichen Datenfragen zusätzlich die Generatoren und AGENTS.md in sghnms_handball_data prüfen.

## Datenhoheit

- data/ wird vom Backend-Workflow aus generated/public/ ersetzt.
- JSON-Dateien in data/ niemals manuell korrigieren.
- Datenfehler im Backend beheben und neu veröffentlichen.
- Automatische Daten-Commits nicht mit einem älteren Stand überschreiben.
- Öffentliche Feldnamen nur in einer koordinierten Backend-/Frontend-Migration ändern.
- Keine Zugangsdaten, Tokens, privaten API-Inhalte oder vertraulichen Personendaten committen.

Die Pflichtdateien sind overview.json, teams.json, matches.json, coverage.json, quality.json, team-analytics.json, players.json und match-analytics/index.json. upcoming-matches.json, standings.json und player-scoring-history.json werden mit einem leeren Fallback geladen und müssen bei Fehlen zu einer funktionsfähigen leeren Darstellung führen.

## Wettbewerbslogik

Der Standardmodus ist league beziehungsweise Ohne Turniere. Die weiteren Modi sind all und tournament.

- Ligaspiele: competitionScope league und regulär statsRelevant.
- Turnier/Nicht-Liga: statsRelevant false oder competitionScope nonLeague/tournament.
- Mit Turnieren kombiniert beide Gruppen.
- Nur Turniere enthält ausschließlich Nicht-Liga-Spiele.
- Tabellen bleiben immer Ligatabellen.
- Im Modus Nur Turniere wird die Ligatabelle ausgeblendet.
- Ein Turnierergebnis darf niemals Tabellenwerte verändern.

Die Dateien team-analytics.json, players.json und player-scoring-history.json können bereits getrennte Scopes liefern. Verwende den passenden Scope und filtere nicht inkonsistent ein zweites Mal.

## Selektor- und Callback-Fallen

Der Helfer $ liefert ein einzelnes Element. Der Helfer $$ liefert ein Array aller Treffer.

Falsch:

    $(".selector").forEach(...)

Richtig:

    $$(".selector").forEach(...)

Übergib Funktionen mit einem optionalen zweiten Modusargument nicht direkt an Array.filter. Array.filter reicht als zweites Callback-Argument den Index weiter; dieser kann den gewünschten Standardmodus überschreiben. matchPassesCompetitionMode ist absichtlich ein Ein-Argument-Prädikat, das state.competitionMode intern liest.

Bei Änderungen an Filtern immer alle drei Wettbewerbsmodi und mehr als ein Listenelement testen.

## Ergebnis- und Qualitätssemantik

Offizielle Ergebnisse bleiben sichtbar, auch wenn Events oder Aufstellungen fehlen oder widersprüchlich sind. eventAnalyticsEligible beziehungsweise die Qualitätsdaten entscheiden, ob Event-Auswertungen wie Spielverlauf, Läufe, Timeout-Nachlauf, Siebenmeter oder Sanktionen verwendet werden dürfen.

Fehlende Detaildaten sind unbekannt und dürfen nicht als Nullwert dargestellt werden. Qualitätswarnungen müssen nachvollziehbar bleiben.

## Zeitdarstellung

Die vom Backend gelieferten handball.net-Zeitwerte repräsentieren lokale Uhrzeiten. Interpretiere sie nicht erneut als echte UTC-Zeit und konvertiere sie nicht ein zweites Mal nach Europe/Berlin. Änderungen an Datumshilfen müssen Sommerzeit, Winterzeit und den DST-Wechsel abdecken.

## Jugendregeln

Die erwarteten Spielzeiten und statistischen Phasen kommen aus dem Backend. Insbesondere:

- D- und E-Jugend: Zwei-Minuten-Strafe ohne Zwei-Minuten-Unterzahl
- E-Jugend: getrennte Darstellung von 2 x 3 gegen 3 und 6 gegen 6

Diese Regeln nicht durch allgemeine Erwachsenenlogik überschreiben.

## Frontend-Änderungen

- Die Anwendung bleibt ohne Build-Schritt und externe Laufzeitabhängigkeiten, sofern keine ausdrücklich koordinierte Architekturänderung beauftragt ist.
- Responsives Verhalten und Tastaturbedienung erhalten.
- Leere, ladende und fehlerhafte Zustände verständlich darstellen.
- In öffentlich sichtbaren Texten Deutsch und bestehende Begriffe konsistent verwenden.
- robots.txt, noindex/nofollow, Manifest und Icons erhalten, sofern nicht ausdrücklich geändert.
- noindex ist keine Zugriffskontrolle; behandle alle eingecheckten Inhalte als öffentlich.

## Cache-Busting

index.html versieht app.js und styles.css mit Versionsparametern. Nach jeder Änderung an app.js oder styles.css den zugehörigen Parameter erhöhen. Eine Änderung ohne Versionssprung kann trotz erfolgreichem Deploy für Nutzer unsichtbar bleiben.

## Prüfung

Mindestens ausführen:

    node --check app.js

Lokal über HTTP starten:

    python3 -m http.server 8000

Danach prüfen:

1. Vereinsstatistik lädt und reagiert auf alle Filter.
2. Trainer-Dashboard lädt für mehrere Teams.
3. Ohne Turniere, Mit Turnieren und Nur Turniere liefern plausible unterschiedliche Mengen.
4. Tabellen bleiben ligaunabhängig von Turnieren und sind im Nur-Turniere-Modus verborgen.
5. kommende Spiele, Gegnerprofil und direkter Vergleich funktionieren mit und ohne optionale Daten.
6. Spieler-, Disziplin- und Einzelspielansichten funktionieren.
7. Lade-, Leer- und Fehlerzustände sind benutzbar.
8. Smartphone- und Desktop-Layout bleiben stabil.

Wenn data/ in der Änderung enthalten ist, JSON-Syntax, generatedAt, coverage und quality prüfen. Backend-generierte Massendiffs nicht manuell glätten.

## Deployment

Jeder Push auf main startet .github/workflows/deploy-pages.yml und veröffentlicht das gesamte Repository. Es gibt keinen vorgeschalteten Testjob. Vor einem Push auf main daher lokal prüfen und danach den Pages-Workflow kontrollieren.

## Änderungshygiene

- Änderungen fokussiert halten.
- Keine neuen globalen Zustände einführen, wenn der bestehende state ausreicht.
- Renderfunktionen nicht mit versteckten Nebenwirkungen koppeln.
- Datenvertrag und UI gemeinsam dokumentieren.
- README.md und diese Datei aktualisieren, wenn Datenfluss, Filter, Deployment oder zentrale Invarianten geändert werden.
