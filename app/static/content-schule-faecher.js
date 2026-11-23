/* Seite "Welche Fächer passen?" (Gruppe Für die Schule), Sie-Form für Lehrkräfte. Ein Vorschlag des Labors, kein Lehrplan und für kein Bundesland geprüft.
   Jede Anknüpfung nennt die Seite im Labor, die dazu passt; die Seiten und ihre Abschnitte sind in den Inhaltsdateien nachprüfbar. */
(function () {

const S = {};

S["schule-faecher"] = {
  nav: "Welche Fächer passen?", typ: "lektion", gruppe: "Für die Schule", titel: "Welche Fächer passen? Einsatz in Mathe, Informatik, Biologie, Deutsch, Ethik und Geschichte", symbol: "book-open", rollen: ["lehrende"], anrede: "sie",
  lernziele: [
    "Sie können für jedes der sechs Fächer zwei bis drei Anknüpfungen an KI nennen.",
    "Sie können zu jeder Anknüpfung die passende Seite oder Einheit im Labor öffnen.",
    "Sie können sagen, was dieses Angebot nicht leistet: Es ist ein Vorschlag, kein Lehrplan.",
  ],
  kurz: "Je Fach zwei bis drei Anknüpfungen mit der passenden Seite im Labor. Ausdrücklich ein Vorschlag, kein Lehrplan und für kein Bundesland geprüft.",
  zusammenfassung: "Fachbezug für Lehrkräfte: Wo KI im Unterricht in Mathe (Abstand und Wahrscheinlichkeit, Fehlerrechnung), Informatik (Daten, Training, Test), Biologie (Mustererkennung, Neuron als Analogie mit Grenzen), Deutsch (Textqualität, Quellenkritik), Ethik (Verzerrung, Deepfake-Dilemma) und Geschichte (Quellenkritik und Fälschungen) anknüpft, je mit passender Seite im Labor. Vorschlag, kein Lehrplan, für kein Bundesland geprüft.",
  abschnitte: [
    {h: "Was diese Seite ist und was nicht",
     kurz: "Eine Ideensammlung nach Fächern. Ob und wo sie in den Lehrplan Ihres Landes und Faches passt, entscheiden Sie. Ein Lehrplanabgleich für ein Bundesland liegt nicht vor.",
     p: [
      "Die Anknüpfungen unten sind Vorschläge des Labors. Sie sind kein Dokument eines Kultusministeriums und für kein Bundesland geprüft. Wo eine Anknüpfung im Lehrplan Ihres Landes steht, suchen Sie selbst heraus. Der Rahmen der Kultusministerkonferenz und die Zuordnung der Einheiten stehen in der {{schule-lehrkraefte|Handreichung für Lehrkräfte}}.",
      "Das Labor bietet zehn fertige Einheiten: drei KI-Stunden ({{schule-stunde-1|KI 1}}, {{schule-stunde-2|KI 2}}, {{schule-stunde-3|KI 3}}) und sieben Medien-Einheiten, beginnend mit {{medien-stunde-1|Medien 1}}. Die Tabelle unten sagt, welche Einheit zu welchem Fach passt. Alle Aufgaben kommen ohne Kamera aus.",
     ],
     merke: "Vorschlag, kein Lehrplan. Die Lehrkraft entscheidet, was in ihr Fach passt."},
    {h: "Überblick: Fach, Anknüpfung, Seite",
     kurz: "Sechs Fächer, je zwei bis drei Anknüpfungen. Die Seiten im Labor sind verlinkt.",
     tabelle: {
      beschriftung: "Fachbezug, Vorschlag des Labors",
      kopf: ["Fach", "Anknüpfung", "Seite im Labor"],
      zeilen: [
       ["Mathe", "Abstand und Mehrheit: Das Punkte-Labor ordnet neue Punkte nach ihrer Nähe zu Beispielpunkten ein", "{{ml|Maschinelles Lernen}}"],
       ["Mathe", "Fehlerrechnung und Prozente: Warum „99 Prozent richtig“ täuschen kann, Konfusionsmatrix, Precision und Recall", "{{bewertung|Wie gut ist ein Modell?}}"],
       ["Mathe", "Funktionen: Summe aus Eingaben mal Gewichte, Schwelle, Nachrechnen unter „Mit Mathe“", "{{neuronale-netze|Neuronale Netze}}"],
       ["Informatik", "Daten, Merkmale, Training, Validierung und Test", "{{daten|Daten, der Rohstoff}} und {{schule-stunde-2|KI 2}}"],
       ["Informatik", "Wie ein Sprachmodell Text in Token zerlegt und Wort für Wort fortsetzt", "{{tokens-sprachmodelle|Wie ein Sprachmodell gebaut ist}}"],
       ["Biologie", "Mustererkennung: Wie Netze Bilder in Merkmale zerlegen und was das mit dem Sehen gemeinsam hat und was nicht", "{{cnn-intuition|Wie Netze Bilder verstehen}}"],
       ["Biologie", "Das künstliche Neuron als Analogie zur Nervenzelle, mit ihren Grenzen", "{{neuronale-netze|Neuronale Netze}}"],
       ["Deutsch", "Textqualität: Gut formuliert heißt nicht richtig, Prompts vergleichen", "{{llm-grenzen|Grenzen und Risiken}} und {{prompts-schule|Gute Fragen an die KI}}"],
       ["Deutsch", "Quellenkritik und Zitieren im Referat", "{{quellen-pruefen|Quellen prüfen}} und {{referat|Für dein Referat über KI}}"],
       ["Ethik", "Verzerrung in Daten und Entscheidungen, Verantwortung", "{{verzerrung-ethik|Fairness, Verzerrung und Verantwortung}}"],
       ["Ethik", "Deepfake-Dilemma: Wenn es einen selbst trifft, was ist richtig?", "{{fake-news-deepfakes|Fake News und Deepfakes}} und {{medien-stunde-3|Medien 3}}"],
       ["Geschichte", "Quellenkritik: Urheber, Interesse und Datum prüfen, wie bei jeder historischen Quelle", "{{quellen-pruefen|Quellen prüfen}} und {{medien-stunde-2|Medien 2}}"],
       ["Geschichte", "Fälschungen früher und heute: Warum gute Fälschungen schwer zu erkennen sind", "{{echt-oder-ki|Echt oder KI?}} und {{medien-stunde-1|Medien 1}}"],
      ]}},
    {h: "Mathe",
     kurz: "Abstand und Mehrheit im Punkte-Labor, Fehlerrechnung mit Konfusionsmatrix, Summe und Gewichte im künstlichen Neuron.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "chart-scatter", text: "Abstand", sub: "Punkte-Labor"},
      {icon: "percent", text: "Fehlerrechnung", sub: "Prozente und Matrix"},
      {icon: "sigma", text: "Summe und Gewicht", sub: "ein Neuron"}]},
     liste: [
      "**Abstand und Mehrheit:** Im Punkte-Labor ordnet das Verfahren einen neuen Punkt nach den Beispielpunkten in seiner Nähe ein. Die Klasse kann den Abstand im Koordinatensystem selbst bestimmen und die Mehrheit auszählen.",
      "**Fehlerrechnung:** Eine Quote von 99 Prozent kann täuschen, wenn eine Gruppe sehr selten ist. Die Seite rechnet das mit einer Konfusionsmatrix und einem Spamfilter durch.",
      "**Funktionen:** Ein Neuron bildet die Summe aus Eingaben mal Gewichten und vergleicht sie mit einer Schwelle. Das lässt sich unter „Mit Mathe“ nachrechnen.",
     ]},
    {h: "Informatik",
     kurz: "Daten und Merkmale, Training, Validierung und Test, Token und Sprachmodell.",
     liste: [
      "**Daten und Training:** Merkmale und Etiketten, Trainings-, Validierungs- und Testdaten, Datenqualität. Die Einheit {{schule-stunde-2|KI 2}} lässt die Klasse das am Punkte-Labor erleben.",
      "**Sprachmodelle:** Text wird in Token zerlegt, in Zahlen übersetzt und Wort für Wort fortgesetzt. Die Seite {{tokens-sprachmodelle|Wie ein Sprachmodell gebaut ist}} erklärt jeden Schritt.",
      "**Algorithmus gegen Lernen:** Statt Regeln zu schreiben, zeigt man Beispiele. Der Einstieg dazu ist {{schule-stunde-1|KI 1}}.",
     ]},
    {h: "Biologie",
     kurz: "Mustererkennung beim Sehen und bei Netzen, das künstliche Neuron als Analogie, mit den Grenzen der Analogie.",
     liste: [
      "**Mustererkennung:** Wie Netze ein Bild in Merkmale zerlegen und aus Merkmalen Merkmale bauen, steht auf {{cnn-intuition|Wie Netze Bilder verstehen}}. Die Klasse kann das mit dem Sehen vergleichen und benennen, wo der Vergleich endet.",
      "**Neuron als Analogie:** Ein künstliches Neuron ist eine Rechenvorschrift mit Eingaben, Gewichten und Schwelle. Eine Nervenzelle ist eine lebende Zelle mit biochemischen Vorgängen. Die Analogie hilft beim Einstieg, trägt aber nicht weit. Lassen Sie die Klasse beide Seiten gegenüberstellen.",
      "**Auffälliges in Bildern:** Das Labor zeigt an einem Beispiel mit Zellbildern, wie ein Modell Auffälliges findet und warum ein übersehener Fall schwerer wiegt als ein Fehlalarm, siehe {{uc-gesundheit-auffaellig|Zweitmeinung: Zellprobe}}.",
     ]},
    {h: "Deutsch",
     kurz: "Textqualität prüfen, Quellenkritik und Zitieren im Referat.",
     liste: [
      "**Textqualität:** Ein KI-Text kann glatt klingen und trotzdem falsch sein. Die Klasse vergleicht gute und schwache Fragen an die KI und beurteilt die Antworten: {{prompts-schule|Gute Fragen an die KI}}, {{llm-grenzen|Grenzen und Risiken von Sprachmodellen}}.",
      "**Quellenkritik:** Urheber, Interesse, Datum: {{quellen-pruefen|Quellen prüfen}} passt zur Texterschließung. Dazu die Einheit {{medien-stunde-2|Medien 2}}.",
      "**Zitieren:** KI-Hilfe angeben und Quellen belegen: {{referat|Für dein Referat über KI}}.",
     ]},
    {h: "Ethik",
     kurz: "Verzerrung in Daten und Entscheidungen, Verantwortung, das Dilemma bei Deepfakes.",
     liste: [
      "**Verzerrung:** Wie Vorurteile in die Daten gelangen und Entscheidungen verzerren, mit Beispielen zu Bewerberauswahl und Kredit: {{verzerrung-ethik|Fairness, Verzerrung und Verantwortung}}.",
      "**Deepfake-Dilemma:** Was ist richtig, wenn ein gefälschtes Bild jemanden bloßstellt: weiterleiten, melden, ignorieren? {{fake-news-deepfakes|Fake News und Deepfakes}} und die Einheit {{medien-stunde-3|Medien 3}} analysieren einen erfundenen Fall.",
      "**Verantwortung:** Wer entscheidet, wenn die Maschine einen Vorschlag macht? Die Seite zur Verzerrung endet mit einer Fragenliste.",
     ]},
    {h: "Geschichte",
     kurz: "Quellenkritik wie bei historischen Quellen, Fälschungen früher und heute.",
     liste: [
      "**Quellenkritik:** Wer hat das wann und mit welchem Interesse veröffentlicht? Dieselben Fragen gelten für historische Quellen und für Meldungen im Netz: {{quellen-pruefen|Quellen prüfen}}.",
      "**Fälschungen:** Fälschungen gibt es nicht erst seit KI. Neu ist, wie schnell und überzeugend sie entstehen. Die Klasse sortiert zwölf Bildkarten in {{medien-stunde-1|Medien 1}} und begründet ihr Urteil.",
     ]},
  ],
  mitnehmen: [
    "Zu jedem der sechs Fächer gibt es zwei bis drei Anknüpfungen mit einer passenden Seite im Labor.",
    "Die Zuordnung ist ein Vorschlag, kein Lehrplan, und für kein Bundesland geprüft.",
    "Die zehn Einheiten (drei KI-Stunden, sieben Medien-Einheiten) liefern Arbeitsblatt, Lösungen und Plan für Einzel- und Doppelstunde.",
  ],
  grenzen: [
    "Vorschlag des Labors, kein Dokument eines Kultusministeriums. Für kein Bundesland geprüft.",
    "Die Biologie-Anknüpfung ist eine Analogie. Sie vereinfacht stark, und die Grenzen der Analogie gehören in den Unterricht.",
  ],
  weiter: ["schule-lehrkraefte", "schule-stunde-1", "medien-stunde-1", "ml", "verzerrung-ethik"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Für die Schule", seiten: ["schule-faecher"] }],
});

const NEU_SYN = {
  faecher: ["=schule-faecher", "=schule-lehrkraefte"],
  fach: ["=schule-faecher", "=schule-lehrkraefte"],
  biologie: ["=schule-faecher", "=cnn-intuition", "=neuronale-netze"],
  mathe: ["=neuronale-netze", "=schule-faecher", "=bewertung"],
  mathematik: ["=neuronale-netze", "=schule-faecher", "=bewertung"],
  informatik: ["=schule-faecher", "=daten", "=tokens-sprachmodelle"],
  deutsch: ["=schule-faecher", "=quellen-pruefen", "=prompts-schule"],
  geschichte: ["=schule-faecher", "=quellen-pruefen", "=echt-oder-ki"],
  fachbezug: ["=schule-faecher", "=schule-lehrkraefte"],
  unterrichtsfach: ["=schule-faecher", "=schule-lehrkraefte"],
  lehrplan: ["=schule-lehrkraefte", "=schule-faecher", "=schule-schulleitung"],
};
for (const [k, ids] of Object.entries(NEU_SYN)) INHALT.synonyme[k] = [...new Set([...ids, ...(INHALT.synonyme[k] || [])])];
})();
