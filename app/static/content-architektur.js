/* Seite "Wie das Labor aufgebaut ist" (Gruppe Der Rechner dahinter) für IT und Nachbauer. Belegt aus docs/betrieb-sicherheit.md, docs/veroeffentlichung.md,
   docs/selbst-aufbauen.md, docs/datenschutz-absatz-entwurf.md (Vermittler: Server bei IONOS, Tunneldienst Cloudflare) und den Seiten betrieb-sicherheit und selbst-bauen.
   Nur Bausteine, die dort genannt sind. Stand: Referenzgerät, 23.11.2026. */
(function () {

const S = {};

S["architektur"] = {
  nav: "Wie das Labor aufgebaut ist", typ: "lektion", gruppe: "Der Rechner dahinter", titel: "Wie das Labor aufgebaut ist", symbol: "network", rollen: ["technik"],
  lernziele: [
    "Du kannst den Weg einer Anfrage vom Browser bis zum Jetson beschreiben.",
    "Du kannst die Bausteine auf dem Gerät nennen: App, Ollama, Whisper, Piper.",
    "Du kannst sagen, welche Vermittler im öffentlichen Betrieb dazwischenliegen und was sie sehen.",
  ],
  kurz: "Ein Diagramm vom Besucher bis zum Sprachmodell: Cloudflare, ein nginx-Server bei IONOS, der Jetson mit App, Ollama, Whisper und Piper. Ein Satz je Baustein.",
  zusammenfassung: "Architektur des KI-Labors: Der Browser des Besuchers erreicht im öffentlichen Betrieb über Cloudflare und einen nginx-Server bei IONOS den Jetson Orin Nano. Dort läuft die App (FastAPI mit uvicorn auf Port 8443), dahinter Ollama für das Sprachmodell und die Einbettung, faster-whisper für Sprache zu Text und Piper für Text zu Sprache. Daten bleiben auf dem Gerät, Sitzungen im Arbeitsspeicher.",
  abschnitte: [
    {h: "Der Weg einer Anfrage",
     kurz: "Browser, Cloudflare, nginx-Server bei IONOS, Jetson. Im Heimnetz entfallen die Vermittler, dann spricht der Browser direkt mit dem Jetson.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "laptop", text: "Besucher", sub: "Browser"},
      {icon: "cloud", text: "Cloudflare", sub: "Tunnel und Schutz"},
      {icon: "server", text: "nginx bei IONOS", sub: "Proxy-Server"},
      {icon: "cpu", text: "Jetson", sub: "App und Modelle", farbe: "gruen"}]},
     p: [
      "Im öffentlichen Betrieb läuft die Verbindung über zwei Vermittler: den Tunneldienst von Cloudflare und einen Proxy-Server bei IONOS mit nginx. Der Jetson selbst öffnet dafür keinen Port im Router, der Tunnel verbindet nur ausgehend (siehe {{betrieb-sicherheit|Betrieb und Sicherheit}}).",
      "Wie bei jedem Proxy und jedem Tunneldienst endet die Verschlüsselung bei den Vermittlern. Sie leiten den Datenverkehr weiter, der Rechner dahinter speichert Eingaben nicht. Im Heimnetz entfallen die Vermittler, der Browser spricht dann direkt mit Port 8443 des Jetson.",
     ],
     merke: "Vermittler im öffentlichen Betrieb: Cloudflare und ein Server bei IONOS. Im Heimnetz keine."},
    {h: "Die Bausteine auf dem Jetson",
     kurz: "Die App nimmt alles entgegen. Ollama rechnet Sprachmodell und Einbettung, Whisper hört, Piper spricht.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "layout-dashboard", text: "App", sub: "FastAPI, uvicorn, Port 8443"},
      {icon: "brain", text: "Ollama", sub: "Sprachmodell, Einbettung"},
      {icon: "mic", text: "Whisper", sub: "Sprache zu Text"},
      {icon: "volume-2", text: "Piper", sub: "Text zu Sprache"}]},
     liste: [
      "**Besucher:** Der Browser lädt die Seiten und ruft die Labore auf. Die Kamera geht über eine WebSocket-Verbindung zur App.",
      "**Cloudflare:** Der Tunneldienst nimmt Verbindungen aus dem Internet an und reicht sie weiter, ohne dass im Router ein Port freigegeben wird.",
      "**nginx bei IONOS:** Der Proxy-Server leitet Anfragen an den Jetson weiter. Er gehört zum öffentlichen Weg, nicht zum Gerät.",
      "**App (FastAPI, uvicorn):** Sie liefert die Seiten, nimmt die Anfragen der Labore entgegen, prüft Origin und Host und begrenzt Anfragen. Sie hört auf Port 8443.",
      "**Ollama:** Der Dienst hinter der App. Er führt das Sprachmodell llama3.2:3b aus und erzeugt Einbettungen mit nomic-embed-text. Die App spricht ihn lokal unter 127.0.0.1:11434 an.",
      "**Whisper (faster-whisper):** Das Modell base wandelt Aufnahmen in Text um. Es rechnet auf dem Referenzgerät auf der CPU.",
      "**Piper:** Die Stimme thorsten-medium macht aus Text hörbare Sprache.",
     ]},
    {h: "Welche Daten wohin gehen",
     kurz: "Chat und Dokumentenfragen laufen zu Ollama, Aufnahmen zu Whisper, Texte zu Piper. Nichts davon wird dauerhaft gespeichert.",
     tabelle: {
      beschriftung: "Datenwege im Labor",
      kopf: ["Aktion im Browser", "Weg", "Ergebnis"],
      zeilen: [
       ["Frage im Chat", "Browser, App, Ollama", "Antwort Stück für Stück zurück"],
       ["Frage an eigene Dokumente (RAG)", "Browser, App, Ollama (Einbettung und Sprachmodell)", "Antwort mit Fundstellen"],
       ["Sprache zu Text", "Browser, App, Whisper", "Text"],
       ["Text zu Sprache", "Browser, App, Piper", "Audio"],
       ["Kamera-Labore", "Browser, WebSocket, App", "Ergebnis pro Bild, das Bild wird nicht gespeichert"],
      ]},
     p: [
      "Sitzungen, zum Beispiel Anlern-Beispiele und eingefügte Texte, leben im Arbeitsspeicher der App und verfallen nach 30 Minuten Ruhe. Es gibt keine Datenbank. Die Modelle liegen auf der SSD.",
     ]},
    {h: "Wo du weiterliest",
     kurz: "Ports, Logs und Schutz: Betrieb und Sicherheit. Einkaufsliste und Befehle: Selbst aufbauen. Die Rechner-Seite zeigt Messwerte live.",
     p: [
      "Welche Ports lauschen, was geloggt wird und welche Schutzmaßnahmen die App hat, steht auf {{betrieb-sicherheit|Betrieb und Sicherheit}}. Die Schritte zum Nachbau stehen auf {{selbst-bauen|Selbst auf einem Jetson aufbauen}}, die Hardware mit Messwerten auf {{hardware|Der Jetson und seine Hardware}}, die Modelle und Lizenzen auf {{lizenzen|Lizenzen und Quellen}}.",
      "Stand ist das Referenzgerät, ein einziges Gerät. Prüfe auf deinem Gerät nach, statt es zu übernehmen.",
     ]},
  ],
  mitnehmen: [
    "Im öffentlichen Betrieb liegen Cloudflare und ein nginx-Server bei IONOS zwischen Browser und Jetson.",
    "Auf dem Jetson arbeiten die App (Port 8443), Ollama (Sprachmodell und Einbettung), Whisper (Sprache zu Text) und Piper (Text zu Sprache).",
    "Sitzungen liegen im Arbeitsspeicher, es gibt keine Datenbank, Aufnahmen und Kamerabilder werden nicht gespeichert.",
  ],
  grenzen: ["Beschreibt das Referenzgerät am 23.11.2026. Der öffentliche Weg ist die Einrichtung des Betreibers, ein Nachbau kann anders aussehen."],
  quiz: [
    {frage: "Welcher Baustein führt das Sprachmodell llama3.2:3b aus?",
     optionen: ["Whisper, das auch die Sprachmodelle verwaltet", "Piper, das Text in Sprache umsetzt", "Ollama, das die App lokal anspricht", "Cloudflare, das den Tunnel bereitstellt"],
     richtig: 2, erklaerung: "Ollama führt das Sprachmodell aus. Whisper wandelt Sprache in Text, Piper Text in Sprache, Cloudflare ist nur der Tunnel."},
    {frage: "Was gilt für die Vermittler im öffentlichen Betrieb?",
     optionen: ["Die Verschlüsselung endet bei ihnen, der Jetson speichert die Eingaben nicht", "Sie führen das Sprachmodell selbst aus und speichern alle Eingaben", "Sie entfallen nie, auch im Heimnetz laufen alle Anfragen darüber", "Sie öffnen einen Port im Router und leiten Anfragen damit weiter"],
     richtig: 0, erklaerung: "Cloudflare und der Server bei IONOS leiten den Verkehr weiter. Im Heimnetz entfallen sie, und der Tunnel verbindet nur ausgehend."},
    {frage: "Wohin geht eine Aufnahme bei Sprache zu Text?",
     optionen: ["Direkt zu Piper, das sie vorliest", "Zu Ollama, das den Ton selbst versteht", "In eine Datenbank, aus der Whisper sie später abholt", "Über die App zu Whisper, das sie in Text umwandelt"],
     richtig: 3, erklaerung: "Die App reicht die Aufnahme an Whisper weiter und schickt den Text zurück. Die Aufnahme wird nicht gespeichert."},
  ],
  weiter: ["betrieb-sicherheit", "selbst-bauen", "hardware", "lizenzen"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Der Rechner dahinter", seiten: ["architektur"] }],
});

const NEU_SYN = {
  architektur: ["=architektur", "=betrieb-sicherheit", "=selbst-bauen", "=hardware"],
  aufbau: ["=architektur", "=selbst-bauen", "=hardware"],
  fastapi: ["=architektur", "=betrieb-sicherheit", "=selbst-bauen"],
  uvicorn: ["=architektur", "=betrieb-sicherheit"],
  ollama: ["=architektur", "=betrieb-sicherheit", "=selbst-bauen", "=lizenzen"],
  nginx: ["=architektur", "=betrieb-sicherheit"],
  cloudflare: ["=architektur", "=betrieb-sicherheit", "=sicherheit-einfach"],
  ionos: ["=architektur", "=betrieb-sicherheit", "=sicherheit-einfach"],
  tunnel: ["=architektur", "=betrieb-sicherheit"],
  piper: ["=architektur", "=sprachausgabe", "=lizenzen"],
  javascript: ["=architektur", "=selbst-bauen"],
  "wie funktioniert das labor": ["=architektur", "=ueber", "=hardware", "=selbst-bauen"],
  "wie ist das labor aufgebaut": ["=architektur", "=ueber", "=hardware", "=selbst-bauen"],
  diagramm: ["=architektur"],
  quelltext: ["=selbst-bauen", "=architektur", "=lizenzen"],
  fehlersuche: ["=selbst-bauen", "=betrieb-sicherheit"],
  backup: ["=betrieb-sicherheit", "=sicherheit-einfach"],
  sicherung: ["=betrieb-sicherheit"],
  datenweg: ["=architektur", "=betrieb-sicherheit", "=sicherheit-einfach"],
};
for (const [k, ids] of Object.entries(NEU_SYN)) INHALT.synonyme[k] = [...new Set([...ids, ...(INHALT.synonyme[k] || [])])];
})();
