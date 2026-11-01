# SGHNMS Analytics

Statisches Dashboard der SG Handball Neumünster für die Saison 2026/27. Die Anwendung läuft ohne Build-Schritt direkt über GitHub Pages und bietet Vereinsstatistik, Trainer-Dashboard und Kampfgericht-Besetzungsplan.

## Aktueller Datenfluss

Die Quelldaten und Berechnungen entstehen im privaten Repository sghnms_handball_data:

1. handball.net wird dort importiert und validiert.
2. Der Backend-Workflow erzeugt die öffentlichen Verträge in generated/public/.
3. Nach einem erfolgreichen Refresh wird der vollständige Inhalt nach data/ in diesem Repository übertragen.
4. Der Commit auf main startet automatisch den GitHub-Pages-Deploy dieses Repositories.
5. app.js lädt die JSON-Dateien mit cache: no-store.

Die Dateien in data/ sind erzeugte Artefakte und dürfen nicht manuell korrigiert werden. Fachliche oder zeitliche Fehler müssen im Daten-Repository behoben und neu veröffentlicht werden.

Die Kampfgerichtsliste ist davon unabhängig. Sie wird manuell unter operations/kampfgericht.csv gepflegt und deshalb vom automatischen Backend-Sync nicht überschrieben.

## Datenstand

Der am 1. November 2026 gegen 17:08 Uhr Europe/Berlin veröffentlichte Stand umfasst:

- 23 SG-Teams
- 100 beendete Spiele
- Events und Aufstellungen für 100 von 100 Spielen
- 98 Spiele mit freigegebener Event-Analyse
- 2 wegen abweichendem Event-Endstand von Event-Analysen ausgeschlossene Spiele
- 97 beendete Ligaspiele im Standardfilter und 3 Turnier-/Nicht-Ligaspiele
- Tabellen für 23 Teams in 24 Wettbewerbsphasen

Das ist eine Momentaufnahme. Maßgeblich sind generatedAt, coverage.json und quality.json im Verzeichnis data/.

## Oberfläche

Die Anwendung besitzt drei Hauptbereiche.

### Vereinsstatistik

Die Vereinsstatistik ermöglicht Filter nach:

- Gesamtverein, Senioren oder Jugend
- Geschlecht und Team
- Zeitraum und Heim/Auswärts
- Wettbewerbsmodus

Sie zeigt unter anderem:

- Ergebnis-KPIs, kumulierte Siegquote und Verlauf
- Teamvergleich und aktuelle Form
- aktuelle Tabellenposition, Positionsverlauf und vollständige Tabelle
- Top-20 der Torschützinnen und Torschützen
- Angriffs- und Abwehr-Rankings, normalisiert auf zehn Spielminuten
- Disziplin-Ranking für Verwarnungen, Zwei-Minuten-Strafen sowie rote und blaue Karten

### Trainer-Dashboard

Nach Auswahl eines Teams stehen zur Verfügung:

- Vorschau auf kommende Spiele mit Form, Gegnerprofil und direktem Vergleich
- Tabelle und Positionsentwicklung
- Ergebnis-, Tor- und Heim/Auswärts-Auswertungen
- Fünf-Minuten-Phasen, Siebenmeter, Sanktionen und Timeout-Nachlauf
- Läufe, torlose Phasen und numerische Situationen
- E-Jugend-Auswertung der Phasen 2 x 3 gegen 3 und 6 gegen 6
- Kader, Einsatz- und Torhistorie
- Spielhistorie und detaillierte Einzelspielanalyse

Spiele mit unzureichender oder widersprüchlicher Ereignisqualität bleiben in den offiziellen Ergebnisstatistiken sichtbar. Sie werden nur aus den betroffenen Event-Auswertungen ausgeschlossen.

### Kampfgericht

Der eigenständige Hauptbereich zeigt den Besetzungsplan der SG-Heimspiele mit:

- Datum und Anwurfzeit
- Halle
- Heim- und Auswärtsmannschaft
- eingeteiltem Kampfgericht

Die Anwendung liest operations/kampfgericht.csv direkt ein. Leere Trennzeilen werden ignoriert; Spiele mit einer bereits vergangenen Anwurfzeit werden anhand der Europe/Berlin-Zeit automatisch ausgeblendet. Die Arbeitsdatei kann historische Zeilen behalten und muss nicht vor jeder Aktualisierung bereinigt werden.

## Wettbewerbsfilter

Beide Bereiche bieten drei Modi:

- **Ohne Turniere** ist der Standard und zeigt nur Ligaspiele.
- **Mit Turnieren** kombiniert Liga und Turnier-/Nicht-Ligaspiele.
- **Nur Turniere** zeigt ausschließlich Turnier-/Nicht-Ligaspiele.

Ein Spiel gilt als Turnierspiel, wenn statsRelevant false oder competitionScope nonLeague beziehungsweise tournament gesetzt ist. Tabellen bleiben immer reine Ligatabellen. Im Modus Nur Turniere wird die Ligatabelle ausgeblendet; im kombinierten Modus wird sie mit einem entsprechenden Hinweis angezeigt.

## Datenverträge

Die Anwendung erwartet in data/:

- overview.json
- teams.json
- matches.json
- coverage.json
- quality.json
- team-analytics.json
- players.json
- match-analytics/index.json und die Einzeldateien unter match-analytics/

Zusätzlich werden mit einem leeren Fallback geladen:

- upcoming-matches.json
- standings.json
- player-scoring-history.json

Die aggregierten Dateien können getrennte league-, all- und tournament-Scopes enthalten. Neue oder geänderte Felder müssen im Backend und Frontend koordiniert werden.

## Technische Struktur

- index.html — Seitenstruktur, Navigation, PWA-Metadaten und Cache-Versionen
- app.js — Datenladen, Zustand, Filter und Rendering
- styles.css — responsives Layout und visuelle Komponenten
- data/ — automatisch publizierte JSON-Daten
- operations/kampfgericht.csv — manuell gepflegter Kampfgericht-Besetzungsplan
- manifest.webmanifest — PWA-Metadaten
- robots.txt und noindex/nofollow — Suchmaschinenhinweise
- .github/workflows/deploy-pages.yml — Veröffentlichung über GitHub Pages
- AGENTS.md — Arbeitsregeln für automatisierte Beiträge

Es gibt kein package.json und keinen Build-Schritt. Jeder Push auf main löst den Pages-Workflow aus, der das gesamte Repository als statische Website veröffentlicht.

## Lokal starten

Ein lokaler HTTP-Server ist nötig, weil die Anwendung Daten per fetch lädt:

    python3 -m http.server 8000

Anschließend http://localhost:8000 öffnen. Das direkte Öffnen von index.html über file:// ist nicht ausreichend.

## Prüfung vor dem Commit

Mindestens ausführen:

    node --check app.js

Zusätzlich manuell prüfen:

- Vereinsstatistik und Trainer-Dashboard
- alle drei Wettbewerbsmodi
- Vereins-, Geschlechts-, Team-, Zeitraum- und Heim/Auswärts-Filter
- kommende Spiele und Gegnerprofil
- Tabellenansicht und Modus Nur Turniere
- Spieler- und Disziplin-Rankings
- Einzelspielansicht
- Kampfgericht-Tab, CSV-Fehlerzustand und zeitliche Filterung
- schmale Smartphone-Ansicht

JSON-Dateien in data/ sollten syntaktisch gültig sein; sie werden normalerweise ausschließlich vom Backend erzeugt.

## Cache-Versionen

index.html lädt app.js und styles.css mit Versionsparametern. Bei jeder Änderung an app.js oder styles.css muss der jeweilige Parameter erhöht werden, damit Browser und GitHub Pages nicht versehentlich eine alte Version ausliefern.

## Deployment

.github/workflows/deploy-pages.yml läuft bei jedem Push auf main und kann zusätzlich manuell gestartet werden. Er konfiguriert GitHub Pages, lädt das gesamte Repository als Artefakt hoch und veröffentlicht es. Es gibt keinen separaten Test- oder Build-Job; lokale Syntax- und Funktionsprüfungen sind deshalb besonders wichtig.

## Datenschutz und Zugriff

Die Seite und das Repository sind öffentlich. robots.txt sowie noindex/nofollow reduzieren die Indexierung, sind aber keine Zugriffskontrolle. In Daten, Quellcode, Logs und Commits dürfen keine Zugangsdaten, Tokens oder vertraulichen Informationen landen.

## Wichtige Implementierungsdetails

- Der Helfer $ liefert genau ein Element; $$ liefert eine Liste. Iteration ist nur über $$ zulässig.
- Wettbewerbsprädikate, die optional einen Modus akzeptieren, dürfen nicht ungebunden an Array.filter übergeben werden, weil filter den Array-Index als zweites Argument übergibt.
- Optionale Datendateien müssen einen getesteten leeren Zustand behalten.
- Die lokale Uhrzeit aus handball.net wird bereits im Daten-Repository normalisiert. Das Frontend darf die gelieferten lokalen Datum-/Zeitbestandteile nicht erneut als UTC nach Europe/Berlin verschieben.
- Kampfgerichtstermine werden als lokale Europe/Berlin-Zeit verglichen; hierfür keine UTC-Konvertierung aus der CSV ableiten.

Weitere verbindliche Regeln stehen in AGENTS.md.

