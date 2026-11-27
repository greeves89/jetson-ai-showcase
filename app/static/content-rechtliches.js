/* Seite "Lizenzen und Quellen": Welche Modelle, Programme, Stimmen und Bilder im Labor stecken, unter welcher Lizenz sie
   stehen und wo die Quelle liegt. Pflichtangaben: "Built with Llama" und Lizenzhinweis (Llama 3.2 Community License,
   Abschnitt 1.b.i und 1.b.iii), Kennzeichnung KI-erzeugter Inhalte (KI-Verordnung Art. 50).
   Die Tabelle mit anklickbaren Quellen baut der Baustein "lizenzen-tabelle" (widgets.js) aus seite.lizenzen; die
   Beispielfotos liest er direkt aus beispiele/manifest.json. Lizenzen geprueft am 22.11.2026 an den genannten Quellen.
   Impressum und Datenschutzerklaerung liegen extern (module.json: seite.impressum_url, seite.datenschutz_url). */
(function () {

const LLAMA_LIZENZ = "https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/LICENSE";
const PIPER_STIMMEN = "https://huggingface.co/rhasspy/piper-voices/tree/main/de/de_DE/";
const ZOO = "https://github.com/opencv/opencv_zoo/tree/main/models/";

INHALT.registriere({
  seiten: {
    lizenzen: {
      nav: "Lizenzen und Quellen", typ: "lektion", gruppe: "Der Rechner dahinter", titel: "Lizenzen und Quellen", symbol: "scale",
      widget: "lizenzen-tabelle", widgetTitel: "Komponenten und ihre Lizenzen", widgetSymbol: "scale",
      rechtslinks: true,
      kurz: "Das Labor nutzt fremde Modelle, Programme, Stimmen und Fotos. Hier steht, was davon wofür läuft, unter welcher Lizenz es steht und wo du die Quelle findest.",
      lizenzen: {
        komponenten: [
          {name: "Llama 3.2 3B (Meta)", zweck: "Sprachmodell für Chat, RAG-Werkstatt, Agent und Prompt-Werkstatt",
           lizenz: "Llama 3.2 Community License und Llama 3.2 Acceptable Use Policy", quelle: "Lizenztext", url: LLAMA_LIZENZ},
          {name: "Llama 3.2 Acceptable Use Policy", zweck: "Regeln, wofür das Sprachmodell nicht benutzt werden darf",
           lizenz: "Teil der Llama-Lizenz", quelle: "Nutzungsrichtlinie", url: "https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/USE_POLICY.md"},
          {name: "Ollama", zweck: "Führt Sprachmodell und Einbettungsmodell auf dem Jetson aus",
           lizenz: "MIT", quelle: "github.com/ollama/ollama", url: "https://github.com/ollama/ollama"},
          {name: "nomic-embed-text (Nomic AI)", zweck: "Wandelt Textabschnitte in Zahlenlisten für die Dokumentsuche (RAG)",
           lizenz: "Apache-2.0", quelle: "Modellkarte", url: "https://huggingface.co/nomic-ai/nomic-embed-text-v1.5"},
          {name: "Whisper base (OpenAI), Fassung faster-whisper-base", zweck: "Spracherkennung im Labor Sprache zu Text",
           lizenz: "MIT", quelle: "Modellkarte", url: "https://huggingface.co/Systran/faster-whisper-base"},
          {name: "faster-whisper und CTranslate2", zweck: "Programme, die Whisper auf dem Prozessor schnell rechnen",
           lizenz: "MIT", quelle: "github.com/SYSTRAN/faster-whisper", url: "https://github.com/SYSTRAN/faster-whisper"},
          {name: "Piper (piper-tts)", zweck: "Text zu Sprache auf dem Jetson",
           lizenz: "GPL-3.0", quelle: "github.com/OHF-Voice/piper1-gpl", url: "https://github.com/OHF-Voice/piper1-gpl"},
          {name: "eSpeak NG", zweck: "Wandelt Text in Lautschrift für Piper",
           lizenz: "GPL-3.0 oder neuer", quelle: "github.com/espeak-ng/espeak-ng", url: "https://github.com/espeak-ng/espeak-ng"},
          {name: "Stimme Thorsten (de_DE-thorsten-medium)", zweck: "Männliche Stimme im Labor Text zu Sprache",
           lizenz: "CC0 (Aufnahmen Thorsten-Voice und Ausgangsmodell laut Modellkarte)", quelle: "Modellkarte", url: PIPER_STIMMEN + "thorsten/medium"},
          {name: "YuNet (face_detection_yunet_2023mar)", zweck: "Findet Gesichter im Kamerabild",
           lizenz: "MIT", quelle: "OpenCV Zoo", url: ZOO + "face_detection_yunet"},
          {name: "MediaPipe Handflächen-Erkennung (palm_detection_mediapipe_2023feb)", zweck: "Findet Handflächen im Kamerabild (Labor Hände und Gesichter)",
           lizenz: "Apache-2.0", quelle: "OpenCV Zoo, Modell von Google MediaPipe", url: ZOO + "palm_detection_mediapipe"},
          {name: "MediaPipe Handpunkte (handpose_estimation_mediapipe_2023feb)", zweck: "Setzt 21 Punkte auf die Hand und unterscheidet linke und rechte Hand",
           lizenz: "Apache-2.0", quelle: "OpenCV Zoo, Modell von Google MediaPipe", url: ZOO + "handpose_estimation_mediapipe"},
          {name: "Gesichtsausdruck (facial_expression_recognition_mobilefacenet_2022july)", zweck: "Schätzt einen von sieben Gesichtsausdrücken",
           lizenz: "Apache-2.0", quelle: "OpenCV Zoo", url: ZOO + "facial_expression_recognition"},
          {name: "Haar-Kaskade für Gesichter (OpenCV)", zweck: "Rückfall, falls YuNet fehlt",
           lizenz: "Intel License Agreement for Open Source Computer Vision Library", quelle: "Modelldatei", url: "https://github.com/opencv/opencv/blob/4.8.0/data/haarcascades/haarcascade_frontalface_default.xml"},
          {name: "YOLOX-S (object_detection_yolox_2022nov)", zweck: "Erkennt Gegenstände wie Fahrzeuge, Flaschen und Personen",
           lizenz: "Apache-2.0", quelle: "OpenCV Zoo", url: ZOO + "object_detection_yolox"},
          {name: "MobileNetV2 (image_classification_mobilenetv2_2022apr)", zweck: "Liefert Bildmerkmale für das Labor Anlernen",
           lizenz: "Apache-2.0", quelle: "OpenCV Zoo", url: ZOO + "image_classification_mobilenet"},
          {name: "OpenCV", zweck: "Bildverarbeitung, rechnet YuNet, YOLOX, MobileNet und die Hand- und Ausdrucksmodelle",
           lizenz: "Apache-2.0 (ab Version 4.5)", quelle: "github.com/opencv/opencv", url: "https://github.com/opencv/opencv"},
          {name: "FastAPI", zweck: "Webserver des Labors",
           lizenz: "MIT", quelle: "github.com/fastapi/fastapi", url: "https://github.com/fastapi/fastapi"},
          {name: "Lucide", zweck: "Symbole der Oberfläche",
           lizenz: "ISC (einige Symbole aus Feather: MIT)", quelle: "Lizenztext", url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE"},
          {name: "ElevenLabs", zweck: "KI-erzeugte Sprecherstimme der Erklärvideos und der Beispielaufnahme im Labor Sprache zu Text",
           lizenz: "Lizenz: siehe Quelle (Nutzungsbedingungen des Anbieters)", quelle: "Nutzungsbedingungen", url: "https://elevenlabs.io/terms-of-use"},
          {name: "Remotion", zweck: "Baut die Animationen der Erklärvideos aus Programmcode",
           lizenz: "Lizenz: siehe Quelle", quelle: "Lizenz", url: "https://www.remotion.dev/docs/license"},
        ],
      },
      abschnitte: [
        {h: "Worum es auf dieser Seite geht",
         kurz: "Fremde Modelle und Programme dürfen hier laufen, weil ihre Lizenzen das erlauben. Manche verlangen dafür einen Hinweis.",
         p: [
          "Eine Lizenz ist die Erlaubnis der Urheber, ihr Werk zu nutzen. Sie sagt, was du damit tun darfst und was du dafür tun musst. Oft ist das wenig: den Namen nennen, den Lizenztext mitgeben oder einen Satz anzeigen.",
          "Die Tabelle oben nennt jede Komponente, ihren Zweck im Labor, die Lizenz und die Quelle. Die Quellen führen zu den Seiten der Urheber. Dort steht der verbindliche Text.",
         ],
         alltag: "Wie die Zutatenliste auf einer Packung: Sie zeigt, was drin ist und woher es kommt. Die Rezepte der Hersteller stehen woanders, die Liste sagt dir, wo.",
         merke: "Diese Seite ist ein Überblick, keine Rechtsberatung. Verbindlich ist der Lizenztext an der Quelle."},
        {h: "Built with Llama",
         kurz: "Das Sprachmodell ist Llama 3.2 von Meta. Seine Lizenz verlangt den sichtbaren Hinweis „Built with Llama“.",
         p: [
          "Chat, RAG-Werkstatt und der Agent laufen mit dem Sprachmodell Llama 3.2 in der Größe 3B. Die Llama 3.2 Community License erlaubt das. Sie verlangt dafür zweierlei: den gut sichtbaren Hinweis „Built with Llama“ und eine Kopie der Lizenz.",
          "Den Hinweis findest du in der Fußzeile jeder Seite und unter jeder Antwort des Modells. Den Lizenztext erreichst du über die Tabelle oben. Der Lizenzhinweis von Meta lautet im Original:",
          "**Llama 3.2 is licensed under the Llama 3.2 Community License, Copyright © Meta Platforms, Inc. All Rights Reserved.**",
          "Zur Lizenz gehört eine Nutzungsrichtlinie (Acceptable Use Policy). Sie nennt Zwecke, für die das Modell nicht eingesetzt werden darf. Auch sie ist oben verlinkt.",
         ]},
        {h: "So erkennst du KI-erzeugte Inhalte",
         kurz: "Alles, was ein KI-Modell hier schreibt oder spricht, ist als solches gekennzeichnet.",
         p: [
          "Die europäische KI-Verordnung verlangt in Artikel 50, dass Menschen erkennen, wann sie mit einer KI zu tun haben und wann ein Text, ein Bild oder eine Stimme von einer KI stammt. Das Labor setzt das so um:",
         ],
         liste: [
          "**Antworten** im Chat, beim Befragen von Dokumenten und beim Agenten tragen den Hinweis „Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges.“",
          "**Stimmen** im Labor Text zu Sprache sind als „KI-erzeugte Stimme“ markiert.",
          "**Erklärvideos** tragen unter dem Spieler den Hinweis „Sprecherstimme KI-erzeugt“.",
          "**Die Beispielaufnahme** im Labor Sprache zu Text ist als KI-erzeugte Stimme gekennzeichnet.",
         ],
         alltag: "Wie das Wort „Anzeige“ über einem Zeitungsartikel: Der Text kann trotzdem nützlich sein. Du liest ihn aber mit dem richtigen Blick.",
         merke: "Ein KI-Modell klingt sicher, auch wenn es irrt. Der Hinweis erinnert dich, Wichtiges selbst zu prüfen."},
        {h: "Die Stimmen im Labor Text zu Sprache",
         kurz: "Das Labor nutzt nur die Stimme Thorsten in mittlerer Qualität. Aufnahmen und Ausgangsmodell sind frei (CC0).",
         p: [
          "Piper lernt eine Stimme aus Aufnahmen eines echten Menschen. Die Aufnahmen von Thorsten stehen unter CC0. Das heißt: Jeder darf sie ohne Bedingungen nutzen.",
          "Eine neue Stimme startet beim Training oft von einem fertigen Modell, dem Ausgangsmodell. Bei manchen Piper-Stimmen erlauben dessen Trainingsdaten nur nicht gewerbliche Nutzung, auch wenn die Aufnahmen selbst frei sind. Solche Stimmen nutzt das Labor deshalb nicht.",
          "Wer eine Stimme selbst einsetzen will, liest vorher die Modellkarte und die Lizenz des Ausgangsmodells.",
         ]},
        {h: "Die Erklärvideos",
         kurz: "Die Sprecherstimme ist KI-erzeugt. Bilder und Musik entstehen aus Programmcode.",
         p: [
          "Die Sprecherstimme der Erklärvideos erzeugt der Dienst ElevenLabs aus einem geschriebenen Text. Es spricht kein Mensch. Die Animationen baut das Programm Remotion aus Code. Die Musik erzeugt ebenfalls ein eigenes Programm, fremde Musik kommt nicht vor.",
          "In den Videos zu den Anwendungsfällen siehst du die Beispielfotos aus dem Labor. Für sie gilt dasselbe wie unten.",
         ]},
        {h: "Beispielfotos und Beispieldaten",
         kurz: "Die Fotos stammen aus Wikimedia Commons und sind gemeinfrei oder CC0. Alles andere ist selbst erzeugt oder erfunden.",
         p: [
          "Für die Beispiele wurden nur Fotos mit der Lizenz CC0 oder gemeinfreie Werke gewählt. Bei ihnen ist keine Namensnennung nötig. Sie steht in der zweiten Tabelle oben trotzdem, freiwillig. Die Fotos sind verkleinert, versteckte Angaben wie Aufnahmeort und Gerät sind entfernt.",
          "Die Bilder für Sichtprüfung, Sortieren und den Gesundheitsfall zeichnet ein Programm. Es gibt dafür keine fremde Vorlage und keine echten Patientendaten. Die Beispieldokumente und Bestelldaten sind frei erfunden. Die Beispielaufnahme einer Besprechung spricht eine KI-erzeugte Stimme, ihr Inhalt ist ebenfalls erfunden.",
         ]},
      ],
      weiter: ["sicherheit-einfach", "hardware"],
    },
  },
  gruppen: [{ name: "Der Rechner dahinter", seiten: ["lizenzen"] }],
});

})();
