/* Seite "Über das Labor": wer dahintersteht, was das Labor ist, wie die Labore arbeiten und wo die Grenzen liegen.
   Nur Fakten aus README.md und docs/. Die Adresse des Autors steht in module.json (seite.autor_url) und in der Fußzeile.
   seo_bauen.mjs beschreibt die Seite im JSON-LD als AboutPage mit dem Autor als Person.
   zusammenfassung: zitierfähige Kurzfassung (2 bis 3 Sätze) für den Rohtext nach dem h1; ohne das Feld leitet
   seo_bauen.mjs sie aus merke, mitnehmen und den Abschnitten ab. */
(function () {

const S = {};

S.ueber = {
  nav: "Über das Labor", typ: "lektion", gruppe: "Der Rechner dahinter", titel: "Über das KI-Labor", symbol: "info",
  ueberSeite: true,
  kurz: "Wer hinter dem KI-Labor steht, was es ist, wie die Labore arbeiten und wo die Grenzen liegen.",
  zusammenfassung: "Das KI-Labor ist ein kostenloses Lernangebot zu künstlicher Intelligenz auf Deutsch, ohne Anmeldung. Es läuft lokal auf einem NVIDIA Jetson Orin Nano, der nur wenige Watt aufnimmt, und nutzt keine externen KI-Dienste. Gebaut hat es Daniel Alisch als Lernprojekt.",
  abschnitte: [
    {h: "Wer dahintersteht",
     kurz: "Das KI-Labor ist ein Projekt von Daniel Alisch. Mehr über ihn steht auf seiner Hauptseite daniel-alisch.site.",
     p: [
      "Daniel Alisch hat das KI-Labor als Lernprojekt gebaut. Es soll zeigen, wie künstliche Intelligenz funktioniert, und zwar so, dass man es selbst ausprobieren kann. Die Hauptseite `daniel-alisch.site` ist unten in der Fußzeile verlinkt. Dort stehen auch Impressum und Datenschutzerklärung.",
     ]},
    {h: "Was das Labor ist",
     kurz: "Ein kostenloses Lernangebot ohne Anmeldung. Alles läuft auf einem einzigen kleinen Rechner, ohne Cloud.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-check", text: "Ohne Anmeldung", sub: "kostenlos nutzbar"},
      {icon: "cpu", text: "Jetson Orin Nano", sub: "wenige Watt"},
      {icon: "shield-check", text: "Ohne Cloud", sub: "keine externen KI-Dienste"}]},
     p: [
      "Das KI-Labor läuft komplett auf einem {{hardware|NVIDIA Jetson Orin Nano}}. Das ist ein Computer im Kartenformat mit einer [[gpu|GPU]], der nur wenige Watt aufnimmt. Sprachmodell, Bilderkennung, Spracherkennung und Sprachausgabe rechnen auf diesem Gerät selbst. Es gibt keine Verbindung zu externen KI-Diensten.",
      "Du brauchst kein Konto und bezahlst nichts. Kamerabilder, Mikrofonaufnahmen und eingetippte Texte werden nur im Arbeitsspeicher verarbeitet und nicht dauerhaft gespeichert. Die Einzelheiten stehen auf der Seite {{sicherheit-einfach|Ist das sicher? Was wird gespeichert?}}.",
     ],
     merke: "Das KI-Labor ist ein Lernprojekt. Es läuft auf einem einzigen kleinen Rechner, nicht in einem Rechenzentrum."},
    {h: "Wie die Seiten aufgebaut sind",
     kurz: "Lektionen erklären, Labore lassen dich ausprobieren, Videos und Selbsttests helfen beim Wiederholen.",
     liste: [
      "**Lektionen** erklären die Grundlagen von null, mit Beispielen aus dem Alltag, Vergleichstabellen, Merksätzen und einem kurzen Selbsttest.",
      "**Labore** laufen live auf dem Jetson: Gesichts- und Objekterkennung über die eigene Webcam, ein Bildmodell anlernen, ein Sprachmodell befragen, Dokumente durchsuchen (RAG), ein Agent mit Werkzeugen, Sprache zu Text und Text zu Sprache.",
      "**Interaktive Bausteine** machen Begriffe greifbar, zum Beispiel ein neuronales Netz im Browser oder der Gradientenabstieg.",
      "**Erklärvideos** fassen Themen in 70 bis 100 Sekunden zusammen.",
      "**Business-Use-Cases** zeigen Beispiele aus Betrieben, mit fertigen Beispieldaten zum Starten per Klick.",
     ]},
    {h: "Selbst nachbauen",
     kurz: "Das Labor ist frei verfügbar. Wie du es auf einem eigenen Jetson aufbaust, steht auf einer eigenen Seite.",
     p: [
      "Wer einen Jetson Orin Nano hat, kann das KI-Labor selbst aufbauen. Die Seite {{selbst-bauen|Selbst auf einem Jetson aufbauen}} zeigt die Schritte, die Einkaufsliste und die häufigsten Fehler. Das Repo liegt öffentlich unter `https://github.com/greeves89/jetson-ai-showcase`.",
     ]},
    {h: "Wie die Labore arbeiten",
     kurz: "Jedes Labor zeigt die Verarbeitung in Schritten, mit der Zeit für jeden Schritt.",
     p: [
      "Wenn du ein Labor startest, schickt dein Browser die Eingabe an den Jetson. Dort rechnet das Modell, und das Ergebnis kommt zurück. Das Labor zeigt dir dabei die einzelnen Schritte und wie lange jeder gedauert hat. Auf der Seite {{hardware|Hardware}} siehst du live, wie stark der Rechner gerade ausgelastet ist.",
      "Kamera und Mikrofon schalten sich nie von allein ein. Vorher fragt dich die Seite, danach dein Browser. Wer nichts freigeben will, nimmt die mitgelieferten Beispielbilder und Beispieldaten.",
     ]},
  ],
  mitnehmen: [
    "Das KI-Labor ist kostenlos, braucht keine Anmeldung und läuft lokal auf einem Jetson Orin Nano.",
    "Es nutzt keine externen KI-Dienste. Eingaben werden nur im Arbeitsspeicher verarbeitet.",
    "Kleine Modelle auf kleiner Hardware: gut zum Verstehen, nicht für den Ernstfall.",
  ],
  grenzen: [
    "Der Jetson hat 8 GB Speicher für CPU und GPU zusammen. Deshalb laufen hier kleine Modelle, und große Sprachmodelle wie in Cloud-Diensten passen nicht darauf.",
    "Kleine Modelle machen mehr Fehler. Antworten des Sprachmodells können falsch oder erfunden sein, prüfe Wichtiges selbst.",
    "Es ist ein einzelnes Gerät. Nur zwei Sprachmodell-Antworten laufen gleichzeitig, bei Andrang wartest du in einer Warteschlange.",
    "Das Labor ist ein Lernangebot und keine Beratung. Für einen echten Einsatz im Betrieb braucht es eigene Prüfung von Daten, Recht und Sicherheit.",
  ],
  weiter: ["start", "hardware", "selbst-bauen", "sicherheit-einfach"],
};

S["selbst-bauen"] = {
  nav: "Selbst aufbauen", typ: "lektion", gruppe: "Der Rechner dahinter", titel: "Selbst auf einem Jetson aufbauen", symbol: "hardware",
  kurz: "Das KI-Labor ist frei verfügbar. So bringst du es auf deinen eigenen Jetson Orin Nano.",
  zusammenfassung: "Das KI-Labor lässt sich auf einem eigenen NVIDIA Jetson Orin Nano mit 8 GB nachbauen. Der Weg: JetPack 6 flashen, Ollama 0.12.3 mit zwei Modellen einrichten, das Repo klonen und zwei Skripte starten, dazu ein freiwilliger Vorab-Check. Einzelne Schritte brauchen sudo. Rechne für den Aufbau mit einem halben bis ganzen Tag. Die Schritt-für-Schritt-Anleitung steht im Repo unter docs/selbst-aufbauen.md.",
  lernziele: [
    "Du kannst sagen, welche Teile du für ein eigenes KI-Labor brauchst.",
    "Du kennst die Schritte vom leeren Jetson bis zum laufenden Labor.",
    "Du weißt, welche Fehler typisch sind und wo du sie nachschlägst.",
  ],
  abschnitte: [
    {h: "Der Weg in sechs Schritten",
     kurz: "Vom leeren Jetson zum laufenden Labor: flashen, prüfen, Ollama, Skripte, Browser.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "download", text: "JetPack 6", sub: "flashen"},
      {icon: "gauge", text: "Leistung", sub: "Modus prüfen"},
      {icon: "list-checks", text: "Check", sub: "scripts/check.sh"},
      {icon: "brain-circuit", text: "Ollama", sub: "2 Modelle"},
      {icon: "terminal", text: "Skripte", sub: "setup und Dienst"},
      {icon: "monitor", text: "Browser", sub: "https, Port 8443", farbe: "gruen"}]},
     p: [
      "Zuerst kommt das Betriebssystem JetPack 6 auf den Jetson. Dann prüfst du den Leistungsmodus und lässt den Vorab-Check laufen. Er liest nur und ändert nichts. Danach installierst du Ollama und lädst die zwei Modelle `llama3.2:3b` und `nomic-embed-text`.",
      "Zum Schluss klonst du das Repo und startest zwei Skripte. `scripts/setup.sh` holt Pakete, Bildmodelle, Whisper und die Stimme und erzeugt das Zertifikat. `scripts/install-service.sh` richtet den Autostart ein. Dann öffnest du `https://<jetson-ip>:8443` im Browser.",
      "Das Labor selbst läuft ohne Administratorrechte. Der Ollama-Installer, der Leistungsmodus und der Start des Dienstes ohne Anmeldung brauchen sudo. Diese Befehle sind unten gekennzeichnet.",
     ],
     alltag: "Wie beim Aufbau eines Regals: erst der Rahmen (JetPack), dann die Böden (Ollama und Modelle), dann die Fachböden mit Beschriftung (das Labor). Die Anleitung liegt bei, du schraubst selbst.",
     merke: "Drei Skripte, davon ist nur der Check freiwillig: Der Check prüft vorher, `setup.sh` richtet ein, `install-service.sh` macht den Autostart. Die wenigen Befehle stehen im nächsten Abschnitt zum Kopieren."},
    {h: "Das brauchst du",
     kurz: "Ein Jetson Orin Nano mit 8 GB, eine NVMe-SSD, ein zweiter Rechner. Eine Kamera am Jetson ist nicht nötig.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "cpu", text: "Jetson Orin Nano", sub: "Developer Kit, 8 GB, Super"},
      {icon: "hard-drive", text: "NVMe-SSD", sub: "mindestens 10 GB frei"},
      {icon: "monitor", text: "Zweiter Rechner", sub: "zum Flashen und Bedienen"},
      {icon: "wifi", text: "Netzwerk", sub: "Kabel oder WLAN"},
      {icon: "terminal", text: "Terminal-Kenntnisse", sub: "Befehle tippen, ssh"},
      {icon: "clock", text: "Zeit für den Aufbau", sub: "halber bis ganzer Tag"}]},
     p: [
      "Das Labor ist für 8 GB Speicher ausgelegt. Kamera und Mikrofon kommen aus dem Browser deines Rechners oder Handys, nicht vom Jetson. Programmieren musst du nicht.",
      "Die Einkaufsliste im Einzelnen. Getestet ist der Aufbau auf der Super-Ausführung des Jetson Orin Nano Developer Kit mit 8 GB. Das Netzteil (19 V) gehört laut NVIDIA zum Kit, eine SSD oder SD-Karte nicht. Die Anleitung nutzt eine NVMe-SSD (M.2), die Bauform ist hier nicht belegt, sie steht im Handbuch zum Kit. Eine SD-Karte, das 4-GB-Modell und andere Jetson-Modelle sind ungetestet. Plane mindestens 10 GB freien Platz ein, die Modelle und Pakete belegen rund 3,2 GB. Zum Flashen und Bedienen brauchst du einen zweiten Rechner, die Anleitung im Repo nennt einen Ubuntu-PC. Ein Wort zur Kühlung: Ein höherer Leistungsmodus macht das Gerät wärmer, achte auf Kühlung. Welche Lösung passt, steht nicht belegt hier.",
      "Zum Preis: NVIDIA nannte im Blog vom 17. Dezember 2024 für das Developer Kit 249 US-Dollar, gesenkt von 499 (Quelle: developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost, am 22.11.2026 erneut gelesen). Händlerpreise, Steuer, SSD und Zubehör kommen dazu: Preis beim Händler erfragen. Die Zeitangabe für den Aufbau ist eine Schätzung, keine Messung. Flashen und Downloads machen den größten Teil aus. Die Lesezeit dieser Seite steht oben in der Kopfzeile und ist davon unabhängig.",
     ],
     merke: "Ein Developer Kit, dazu SSD und zweiter Rechner, ein halber bis ganzer Tag für den Aufbau, ein Terminal. Mehr nicht."},
    {h: "Die Befehle zum Kopieren",
     kurz: "Wenige Befehle, in der Reihenfolge der Anleitung. Wer sudo braucht, ist gekennzeichnet.",
     p: [
      "Das Repo muss unter `~/jetson-ai-showcase` liegen, die Dienstdatei erwartet diesen Pfad. Vor dem Ollama-Schritt meldet der Check Fehler bei Ollama und den Modellen. Das ist normal.",
      "Ollama-Version: Das Referenzgerät läuft mit Ollama 0.12.3, der zweite Block installiert genau diese Version. Sie ist wichtig, weil `llama3.2:3b` mit ihr bei langen Eingaben (ab etwa 1100 Tokens) nur Kauderwelsch lieferte, wenn alle Schichten auf der GPU lagen. Das Labor umgeht das mit 24 GPU-Schichten. Mit anderen Versionen ist es nicht getestet, teste dann mit einem langen Text. Ob der Installer auf einem frischen Gerät die richtige GPU-Ausführung wählt, ist nicht nachgeprüft.",
     ],
     code: [
      {titel: "1. Leistungsmodus ansehen", text: "nvpmodel -q"},
      {titel: "2. Leistungsmodus umstellen (nur wenn nötig)", sudo: "Der Befehl ändert eine Einstellung des ganzen Systems. Nimm eine Nummer aus der Liste, rate nicht.",
       text: "sudo nvpmodel -q --verbose\nsudo nvpmodel -m <Nummer>"},
      {titel: "3. Repo holen und Vorab-Check", text: "git clone https://github.com/greeves89/jetson-ai-showcase.git ~/jetson-ai-showcase\ncd ~/jetson-ai-showcase\nbash scripts/check.sh"},
      {titel: "4. Ollama 0.12.3 installieren", sudo: "Der Installer legt einen Systemdienst an.",
       text: "curl -fsSL https://ollama.com/install.sh | OLLAMA_VERSION=0.12.3 sh"},
      {titel: "5. Ollama-Einstellungen für den Jetson", sudo: "Der Befehl ändert den Systemdienst von Ollama. Der Editor öffnet sich, trage dort die fünf Zeilen unten ein.",
       text: "sudo systemctl edit ollama\n\n# im Editor eintragen:\n[Service]\nEnvironment=\"OLLAMA_FLASH_ATTENTION=1\"\nEnvironment=\"OLLAMA_KV_CACHE_TYPE=q8_0\"\nEnvironment=\"OLLAMA_CONTEXT_LENGTH=4096\"\nEnvironment=\"OLLAMA_KEEP_ALIVE=30m\"\nEnvironment=\"OLLAMA_MAX_LOADED_MODELS=2\"\n\n# nach dem Speichern:\nsudo systemctl restart ollama"},
      {titel: "6. Die zwei Modelle laden", text: "ollama pull llama3.2:3b\nollama pull nomic-embed-text\nollama list"},
      {titel: "7. Labor einrichten und als Dienst starten", text: "cd ~/jetson-ai-showcase\nbash scripts/setup.sh\nbash scripts/install-service.sh\nbash scripts/check.sh"},
      {titel: "8. Nur bei Warnung zu linger", sudo: "Ohne diesen Schritt startet der Dienst nach einem Neustart erst, wenn du dich anmeldest.",
       text: "sudo loginctl enable-linger \"$USER\""},
      {titel: "Update später", text: "cd ~/jetson-ai-showcase\ngit pull\nbash scripts/setup.sh\nsystemctl --user restart jetson-showcase"},
     ],
     merke: "Mit sudo laufen nur Ollama-Installer, Leistungsmodus, Ollama-Einstellungen und linger. Das Labor selbst läuft ohne Administratorrechte."},
    {h: "Wo du die Anleitung findest",
     kurz: "Alles steht im öffentlichen Repo, auch mit Einstellungen und Fehlersuche. Die wichtigsten Befehle stehen schon oben.",
     p: [
      "Das Repo liegt öffentlich auf GitHub: [github.com/greeves89/jetson-ai-showcase](https://github.com/greeves89/jetson-ai-showcase). Die ausführliche Anleitung mit allen Einstellungen: [docs/selbst-aufbauen.md](https://github.com/greeves89/jetson-ai-showcase/blob/main/docs/selbst-aufbauen.md). Der Vorab-Check heißt `scripts/check.sh`.",
      "Im Dokument steht auch, was geprüft wurde und was nicht. Aufgebaut ist das Labor bisher nur auf einem einzigen Gerät. Ein frischer Jetson ist noch nicht von Dritten getestet worden. Ungetestet sind auch eine SD-Karte statt NVMe, das 4-GB-Modell und andere Ollama-Versionen als 0.12.3.",
     ],
     merke: "Wenn etwas nicht klappt: erst `scripts/check.sh` laufen lassen, dann die Fehlersuche im Dokument ansehen."},
    {h: "Wenn etwas nicht klappt",
     kurz: "Die häufigsten Fehler haben feste Ursachen. Die Tabelle hat alle 15 Zeilen der Anleitung.",
     visual: {typ: "vergleich", links: {titel: "Typisch", icon: "triangle-alert", farbe: "orange",
        punkte: ["Zu wenig freier Speicher", "Ollama-Fehler bei langen Eingaben", "Kamera ohne HTTPS", "Port 8443 belegt"]},
       rechts: {titel: "Hilfe", icon: "wrench", farbe: "gruen",
        punkte: ["scripts/check.sh", "scripts/cache_leeren.py", "Tabelle im Dokument", "Issue im Repo melden"]}},
     p: [
      "Auf dem kleinen Rechner teilen sich CPU und GPU denselben Speicher. Die meisten Probleme kommen daher, dass dort zu wenig frei ist oder dass ein Modell zu viel auf einmal will.",
     ],
     tabelle: {
      beschriftung: "Fehlersuche, alle 15 Zeilen wie in der Anleitung",
      kopf: ["Symptom", "Ursache", "Lösung"],
      zeilen: [
       ["Browser meldet „Verbindung nicht sicher“", "Selbstsigniertes Zertifikat", "Warnung einmal bestätigen"],
       ["Kamera oder Mikrofon lässt sich nicht freigeben", "Seite über http oder Warnung nicht bestätigt", "`https://<jetson-ip>:8443` öffnen"],
       ["Seite meldet „Invalid host header“ (HTTP 400)", "Adresse nicht erlaubt, zum Beispiel eigener Name oder Tunnel", "Adresse in `SHOWCASE_ALLOWED_HOSTS` eintragen, Dienst neu starten"],
       ["Dienst startet nicht, Status exit 3", "Port 8443 belegt, oft von einem von Hand gestarteten `uvicorn`", "`ps -eo pid,lstart,args | grep \"[u]vicorn app.app\"`, den fremden Prozess beenden, Dienst neu starten"],
       ["Leere Antwort, „unable to allocate CUDA0 buffer“, Ollama 500", "Zu wenig freier Speicher durch Dateicache", "`python3 scripts/cache_leeren.py` (ohne sudo), bei Wiederholung andere Programme beenden"],
       ["Antworten aus „GGGG“ oder Kauderwelsch bei langem Text", "Fehler von Ollama 0.12.3 bei voller GPU-Auslagerung", "`KL_LLM_GPU_SCHICHTEN=24` nicht erhöhen, bei anderer Ollama-Version testen"],
       ["Speicherfehler (OOM) beim Laden des Sprachmodells", "`KL_LLM_GPU_SCHICHTEN` zu hoch, 28 scheiterte", "Wert senken, 24 wählen"],
       ["„Ollama nicht erreichbar“", "Ollama-Dienst läuft nicht", "`sudo systemctl status ollama`, `sudo systemctl restart ollama` (braucht sudo)"],
       ["Modell fehlt (Fehler beim Chat oder RAG)", "Modell nicht geladen", "`ollama pull llama3.2:3b` und `ollama pull nomic-embed-text`"],
       ["Gesichts- oder Objekterkennung bricht mit Importfehler von `cv2` ab", "numpy 2 oder neuer überschreibt die Version, die OpenCV aus JetPack erwartet", "`python3 -m pip install --user 'numpy<2'`, Dienst neu starten"],
       ["`pip: command not found`", "pip ist bei JetPack nicht dabei", "Normal, `setup.sh` richtet `python3 -m pip` ein. Immer `python3 -m pip` benutzen"],
       ["Hinweis „Du bist Nr. 2“ oder „ausgelastet“", "Es laufen schon zwei Sprachmodell-Antworten", "Warten, das Labor wiederholt bis zu dreimal selbst"],
       ["Spracherkennung dauert lange", "Whisper rechnet auf der CPU, etwa dreimal Echtzeit", "Erwartet, bei Bedarf `WHISPER_MODELL` kleiner wählen"],
       ["Dienst läuft nach Neustart nicht", "`linger` nicht aktiv", "`sudo loginctl enable-linger \"$USER\"` (braucht sudo)"],
       ["Beim Beenden des Dienstes bricht die SSH-Sitzung ab", "`pkill -f \"uvicorn app.app\"` trifft die eigene Shell", "`pkill -f \"[u]vicorn app.app\"` (die Klammern sind der Trick) oder besser `systemctl --user stop jetson-showcase`"],
      ]},
     merke: "Die meisten Fehler sind Speicherfragen. Erst Platz schaffen, dann weitersuchen."},
    {h: "Im Heimnetz oder öffentlich",
     kurz: "Zum Lernen und Vorführen bleibt das Labor im Heimnetz. Öffentlich geht es, braucht aber mehr Arbeit.",
     p: [
      "Standardmäßig ist das Labor nur im eigenen Netz erreichbar und für Suchmaschinen gesperrt. Das ist der Normalfall. Leite den Port nicht im Router ins Internet weiter.",
      "Willst du es öffentlich betreiben, starte den Dienst mit `OEFFENTLICH=1`. Dann gilt eine Ratenbegrenzung je Besucher. Die weiteren Schritte und die nötigen Rechtstexte beschreibt `docs/veroeffentlichung.md`. Das ist keine Rechtsberatung.",
     ],
     merke: "Heimnetz ist der einfache Weg. Öffentlich ist ein eigenes Projekt."},
    {h: "Lizenzen",
     kurz: "Das Sprachmodell verlangt den Hinweis „Built with Llama“. Die Lizenz des Codes legt der Betreiber noch fest.",
     p: [
      "Das Sprachmodell Llama 3.2 von Meta steht unter der Llama 3.2 Community License. Sie verlangt den sichtbaren Hinweis „Built with Llama“. Das Labor zeigt ihn in der Fußzeile. Wer das Labor weitergibt oder öffentlich betreibt, behält ihn bei. Die Lizenzen der übrigen Bausteine stehen auf der Seite {{lizenzen|Lizenzen und Quellen}}.",
      "Du darfst das Labor für dich aufbauen und nutzen, indem du es von GitHub klonst. Die Lizenz des Codes legt der Betreiber noch fest. Bis dahin gilt keine ausdrückliche Erlaubnis zur Weitergabe.",
     ]},
  ],
  mitnehmen: [
    "Du brauchst einen Jetson Orin Nano mit 8 GB, eine NVMe-SSD und einen zweiten Rechner.",
    "Der Weg: JetPack 6, Vorab-Check, Ollama 0.12.3 mit zwei Modellen, zwei Skripte, Browser. Mit sudo laufen nur Ollama und der Leistungsmodus.",
    "Die meisten Fehler sind Speicherfragen. Die Anleitung im Repo hat eine Tabelle dafür.",
  ],
  quiz: [
    {frage: "Was macht scripts/check.sh?",
     optionen: ["Es installiert alle Pakete", "Es prüft den Jetson, ohne etwas zu ändern", "Es startet den Dienst neu", "Es lädt die Modelle herunter"],
     richtig: 1, erklaerung: "Der Check liest nur: Version, Speicher, Ollama, Modelle, Port. Er meldet OK, Warnung oder Fehler. Installieren und Starten übernehmen die anderen Skripte."},
    {frage: "Wo kommen Kamera und Mikrofon für die Labore her?",
     optionen: ["Von einer Kamera am Jetson", "Aus dem Browser deines Rechners oder Handys", "Aus der Cloud", "Von einer SD-Karte"],
     richtig: 1, erklaerung: "Der Browser gibt Kamera und Mikrofon frei, und nur über HTTPS. Am Jetson brauchst du keine."},
    {frage: "Die Antworten des Sprachmodells sind plötzlich leer, im Protokoll steht „unable to allocate CUDA0 buffer“. Was hilft zuerst?",
     optionen: ["Ein größeres Modell laden", "Den Dateicache freigeben", "Das Zertifikat erneuern", "Python neu installieren"],
     richtig: 1, erklaerung: "CPU und GPU teilen sich den Speicher, und der Dateicache blockiert ihn. scripts/cache_leeren.py gibt ihn ohne Administratorrechte frei."},
    {frage: "Was verlangt die Llama 3.2 Community License vom Labor?",
     optionen: ["Eine Gebühr je Antwort", "Den sichtbaren Hinweis „Built with Llama“", "Dass das Labor nur im Heimnetz läuft", "Dass keine Fragen gestellt werden"],
     richtig: 1, erklaerung: "Der Hinweis steht in der Fußzeile jeder Seite. Wer das Labor weitergibt, behält ihn bei."},
  ],
  weiter: ["hardware", "lizenzen", "ueber", "sicherheit-einfach"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Der Rechner dahinter", seiten: ["ueber", "selbst-bauen"] }],
});

/* Startseite: zitierfähige Kurzfassung für den Rohtext (seo_bauen.mjs, nach dem h1) */
if (INHALT.seiten.start && !INHALT.seiten.start.zusammenfassung) {
  INHALT.seiten.start.zusammenfassung = "Das KI-Labor ist ein kostenloses Lernangebot zu künstlicher Intelligenz auf Deutsch, ohne Anmeldung. Es läuft lokal auf einem NVIDIA Jetson Orin Nano und nutzt keine externen KI-Dienste. Zu den Themen gibt es Erklärungen, Versuche zum Ausprobieren, Erklärvideos und kurze Selbsttests.";
}
})();
