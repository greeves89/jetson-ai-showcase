/* Seite "Gute Fragen stellen, mit Schulbeispielen": Prompt-Werkstatt für Schüler:innen (Referat, Vokabeln, Lernplan).
   Ohne Kundendaten. Die Büro-Seite "prompting" bleibt für Betriebe. Beispiele sind erfunden. */
window.INHALT.registriere({

gruppen: [{ name: "Medienkompetenz", seiten: ["prompts-schule"] }],

seiten: {

"prompts-schule": {
  nav: "Prompt-Werkstatt", typ: "lektion", gruppe: "Medienkompetenz", titel: "Gute Fragen stellen, mit Schulbeispielen", symbol: "message-square",
  kurz: "Ein Prompt ist deine Frage an die KI. Mit drei Schulaufgaben siehst du, wie aus einer schwachen Frage eine gute wird. Zum Kopieren.",
  zusammenfassung: "Ein Prompt ist die Frage oder Aufgabe, die du einer KI schreibst. Je genauer du schreibst, desto brauchbarer die Antwort. Die Seite zeigt drei Schulaufgaben (Referat, Vokabeln, Lernplan), je mit einem schlechten und einem guten Prompt zum Kopieren und einem Quiz.",
  lernziele: [
    "Du kannst in zwei Sätzen sagen, was ein Prompt ist.",
    "Du kannst einen schwachen Prompt für eine Schulaufgabe verbessern.",
    "Du kannst eine Antwort der KI prüfen, bevor du sie benutzt.",
  ],
  abschnitte: [
    {h: "Was ist ein Prompt?",
     kurz: "Ein Prompt ist deine Frage oder Aufgabe an die KI. Je genauer du schreibst, desto besser die Antwort.",
     visual: {typ: "ablauf", schritte: [
      {icon: "pencil", text: "Du schreibst", sub: "den Prompt"},
      {icon: "bot", text: "Die KI antwortet", sub: "mit dem Wahrscheinlichen"},
      {icon: "search", text: "Du prüfst", sub: "bevor du es nutzt", farbe: "gruen"}]},
     p: [
      "Ein Prompt ist der Text, den du einer KI schickst: eine Frage, eine Aufgabe oder beides. Die KI kennt nur das, was du schreibst, und ergänzt den Rest mit dem Üblichen.",
      "Darum bekommst du auf eine knappe Frage eine allgemeine Antwort. Wenn du Klasse, Länge und Ziel nennst, passt sie besser. Die Bausteine dazu stehen auf {{prompts-fuer-schueler|Gute Fragen an die KI stellen}}.",
     ],
     merke: "Prompt heißt: deine Frage an die KI. Genauer fragen bringt bessere Antworten."},
    {h: "Aufgabe 1: Referat",
     kurz: "Lass dir eine Gliederung vorschlagen und schreib den Text selbst.",
     p: [
      "Schlecht: Die KI soll das Referat schreiben. Dann hast du nichts gelernt und gibst etwas ab, das nicht von dir ist. Gut: Du bittest nur um Ideen und schreibst selbst.",
     ],
     code: [
      {titel: "Schlechter Prompt", text: "Schreib mir ein Referat über Windkraft."},
      {titel: "Guter Prompt", text: "Ich halte ein Referat über Windkraft, 5 Minuten, Klasse 9. Schlage mir eine Gliederung mit fünf Punkten vor und nenne bei jedem Punkt ein Stichwort, das ich nachschlagen kann. Schreib keinen Text. Den schreibe ich selbst."},
     ],
     merke: "Quellen für das Referat findest du auf der Seite {{referat|Für dein Referat über KI}}. Die KI soll sie dir nicht erfinden."},
    {h: "Aufgabe 2: Vokabeln",
     kurz: "Lass dich abfragen, eine Vokabel nach der anderen.",
     p: [
      "Schlecht: Du bekommst eine lange Liste und liest sie nur durch. Gut: Die KI fragt dich ab und wartet auf deine Antwort. So übst du aktiv.",
     ],
     code: [
      {titel: "Schlechter Prompt", text: "Gib mir Vokabeln für Englisch."},
      {titel: "Guter Prompt", text: "Frag mich zehn Vokabeln zum Thema Reisen ab, Englisch, Klasse 7. Stell immer nur eine Frage und warte auf meine Antwort. Sag mir danach, ob sie richtig war, und gib mir bei einem Fehler nur einen Hinweis."},
     ]},
    {h: "Aufgabe 3: Lernplan",
     kurz: "Nenne Tage, Zeit und Ziel. Dann wird der Plan machbar.",
     p: [
      "Schlecht: Der Plan passt nicht zu deiner Woche. Gut: Du sagst, wie viel Zeit du hast und was du schon kannst.",
     ],
     code: [
      {titel: "Schlechter Prompt", text: "Mach mir einen Lernplan für die Mathearbeit."},
      {titel: "Guter Prompt", text: "Ich schreibe in 10 Tagen eine Mathearbeit über Prozentrechnung, Klasse 8. Ich habe jeden Tag außer Sonntag 30 Minuten Zeit. Mit Dreisatz komme ich gut klar, Zinsen verstehe ich noch nicht. Mach mir einen Plan als Tabelle mit Tag, Thema und einer Übung."},
     ],
     merke: "Gute Prompts nennen Aufgabe, Niveau, Zeit und Format. Probiere sie im {{chat|Chat}} aus."},
    {h: "Antwort prüfen, dann nutzen",
     kurz: "Die KI klingt sicher, auch wenn sie irrt. Prüfe Zahlen, Namen und Behauptungen. Der Chat im Labor ist ein kleines Modell und macht mehr Fehler.",
     p: [
      "Im Labor läuft ein kleines Sprachmodell auf einem kleinen Rechner. Es antwortet manchmal falsch und erfindet Quellen. Das gilt auch für große Chatbots, nur seltener. Wie du Quellen prüfst, steht auf {{quellen-pruefen|Quellen prüfen}}.",
      "Ob und wie du KI für Hausaufgaben nutzen darfst, entscheiden deine Schule und deine Lehrkraft. Frag nach, siehe {{ki-hausaufgaben-fair|KI bei Hausaufgaben}}.",
     ]},
  ],
  mitnehmen: [
    "Ein Prompt ist deine Frage an die KI. Genauer fragen bringt bessere Antworten.",
    "Lass dich erklären und abfragen, statt die Arbeit abzugeben.",
    "Prüfe jede Antwort, bevor du sie benutzt.",
  ],
  quiz: [
    {frage: "Was ist ein Prompt?",
     optionen: ["Eine Frage oder Aufgabe, die du an die KI schreibst", "Ein Programm, das Hausaufgaben automatisch löst", "Die Antwort, die dir die KI am Ende zurückgibt", "Ein Passwort, mit dem du den Chat freischaltest"],
     richtig: 0, erklaerung: "Der Prompt ist dein Text an die KI. Die Antwort ist das, was zurückkommt."},
    {frage: "Welcher Prompt hilft dir beim Lernen für die Vokabelarbeit am meisten?",
     optionen: ["Schreib mir alle Vokabeln der Lektion mit Übersetzung auf", "Übersetze mir diese Liste und gib mir die Lösungen", "Frag mich zehn Vokabeln ab, immer nur eine, und warte", "Fasse die Lektion zusammen, damit ich nichts lesen muss"],
     richtig: 2, erklaerung: "Beim Abfragen musst du selbst denken und bekommst Rückmeldung. Fertige Listen liest du nur durch."},
    {frage: "Die KI nennt für dein Referat ein Buch mit Autor und Jahr. Was tust du?",
     optionen: ["Ich übernehme es, so genaue Angaben sind meist richtig", "Ich frage die KI, ob sie sich sicher ist, und glaube ihr", "Ich lasse das Jahr weg, dann fällt ein Fehler nicht auf", "Ich suche das Buch selbst, bevor ich es angebe"],
     richtig: 3, erklaerung: "Genaue Angaben können erfunden sein. Nur die eigene Suche klärt, ob es das Buch gibt."},
  ],
  weiter: ["prompts-fuer-schueler", "prompts-alltag", "chat", "referat", "ki-hausaufgaben-fair"],
},

},
});
