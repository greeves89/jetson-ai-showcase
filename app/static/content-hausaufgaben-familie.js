/* Seite "Hausaufgaben und KI zu Hause: eine Vereinbarung" (Gruppe Medienkompetenz), Sie-Form für Eltern.
   Bausteine als Vorschlag, kein Regelwerk: die Regeln der Schule gehen vor. Aussagen zu Handy aus bei Hausaufgaben stützen sich auf SCHAU HIN!
   (schau-hin.info/bildschirmzeiten, abgerufen am 23.11.2026), zum Gespräch statt Kontrolle auf die Seite "KI bei Hausaufgaben" und die KMK-Handlungsempfehlung
   (10.10.2024, siehe dort). Das PDF zum Ausfüllen (/static/materialien/hausaufgaben-vereinbarung-familie.pdf) liefert das Materialienpaket. Die Beispiele sind erfunden. */
(function () {

const S = {};

S["hausaufgaben-familie"] = {
  nav: "Hausaufgaben-Vereinbarung", typ: "lektion", gruppe: "Medienkompetenz", titel: "Hausaufgaben und KI zu Hause: eine Vereinbarung", symbol: "handshake", rollen: ["eltern"], anrede: "sie",
  downloads: [{text: "Vereinbarung zum Ausfüllen", sub: "Für Eltern und Kind, getrennt für 12 und 15 Jahre", href: "/static/materialien/hausaufgaben-vereinbarung-familie.pdf"}],
  lernziele: [
    "Sie können sechs Bausteine einer Vereinbarung nennen: erlaubt, nicht erlaubt, kennzeichnen, prüfen, Zeiten, Streit.",
    "Sie können die Regeln für ein Kind mit 12 und ein Kind mit 15 Jahren unterschiedlich formulieren.",
    "Sie können die Vereinbarung ausdrucken, gemeinsam ausfüllen und nach einigen Wochen überprüfen.",
  ],
  kurz: "Eine Vereinbarung für zu Hause in sechs Bausteinen, mit eigenen Vorschlägen für 12 und für 15 Jahre. Zum gemeinsamen Ausfüllen und Aufhängen. Die Regeln der Schule gehen vor.",
  zusammenfassung: "Vorschlag für eine Familienvereinbarung zur KI bei den Hausaufgaben, in Sie-Form für Eltern. Sechs Bausteine: wann KI erlaubt ist, wann nicht, wie die Hilfe gekennzeichnet wird, wie Antworten geprüft werden, Zeiten, und was bei Streit gilt. Mit getrennten Vorschlägen für Kinder mit 12 und mit 15 Jahren, Sätzen zum Übernehmen und einem PDF zum Ausfüllen. Vorschlag, kein Regelwerk. Die Regeln der Schule gehen vor.",
  abschnitte: [
    {h: "Warum eine Vereinbarung",
     kurz: "Regeln, die Ihr Kind mit aushandelt, werden eher eingehalten als verordnete. Schreiben Sie sie auf und prüfen Sie nach einigen Wochen.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "messages-square", text: "Sprechen", sub: "was ist uns wichtig"},
      {icon: "pen-line", text: "Aufschreiben", sub: "sechs Bausteine"},
      {icon: "handshake", text: "Unterschreiben", sub: "beide", farbe: "gruen"},
      {icon: "eye", text: "Nachsehen", sub: "nach einigen Wochen"}]},
     p: [
      "Die Schule legt fest, was bei Hausaufgaben mit KI gilt. Zu Hause bleibt Ihnen die Frage, wie Ihr Kind mit der Hilfe umgeht. Eine kurze Vereinbarung nimmt Streit aus dem Alltag, weil jeder weiß, was gilt. Die Sätze unten sind Vorschläge. Passen Sie sie an Ihr Kind an.",
      "Hintergrund und Gespräche finden Sie auf {{ki-hausaufgaben-fair|KI bei Hausaufgaben: fair nutzen}} und {{eltern-zuhause|KI zu Hause}}.",
     ],
     merke: "Vorschlag, kein Regelwerk. Wenn die Schule etwas anderes verlangt, gilt die Schule."},
    {h: "Die sechs Bausteine für 12 und für 15 Jahre",
     kurz: "Wann KI erlaubt ist, wann nicht, wie gekennzeichnet wird, wie geprüft wird, welche Zeiten gelten und was bei Streit passiert. Die Tabelle zeigt beide Altersstufen nebeneinander.",
     tabelle: {
      beschriftung: "Bausteine der Vereinbarung, Vorschläge nach Alter",
      kopf: ["Baustein", "Mit 12 Jahren", "Mit 15 Jahren"],
      zeilen: [
       ["1 Wann KI erlaubt ist", "Zum Erklären lassen und zum Abfragen, wenn ein Elternteil in der Nähe ist. Erst selbst versuchen.", "Zum Erklären, Abfragen, Feedback zu eigenen Texten und zum Ideensammeln. Erst selbst versuchen."],
       ["2 Wann nicht", "Nicht für Aufsatz, Rechenweg oder Lösung, die das Kind abgibt. Nicht, wenn die Lehrkraft es untersagt hat.", "Nicht für Texte oder Lösungen, die als eigene Leistung abgegeben werden. Nicht, wenn die Lehrkraft es untersagt hat."],
       ["3 Wie wir kennzeichnen", "Das Kind sagt, wofür es die KI genutzt hat. Auf Wunsch der Schule schreibt es dazu: Werkzeug, Datum, Zweck.", "Das Kind kennzeichnet selbst nach den Vorgaben der Schule: Werkzeug, Datum, Zweck und eigener Anteil."],
       ["4 Wie wir Antworten prüfen", "Wichtige Zahlen und Namen prüft das Kind mit Ihnen gegen eine zweite Quelle.", "Das Kind prüft Zahlen, Namen und Quellen selbst gegen eine zweite Quelle und zeigt Ihnen auf Nachfrage, wie."],
       ["5 Zeiten", "Handy und Tablet sind bei den Hausaufgaben aus, bis auf das, was gerade gebraucht wird. KI nur in der vereinbarten Zeit.", "Das Handy liegt bei den Hausaufgaben außer Reichweite, KI nur für den vereinbarten Zweck. Die Zeit legen Sie gemeinsam fest."],
       ["6 Was wir bei Streit tun", "Wir reden am selben Tag darüber. Bei Streit pausiert KI bei den Hausaufgaben für diesen Tag, ohne Strafe.", "Wir reden innerhalb von zwei Tagen darüber. Das Kind darf die Regel mit Gründen infrage stellen, wir passen sie gemeinsam an."],
      ]},
     p: [
      "Die Zeilen zu 12 und 15 Jahren sind Vorschläge nach dem, was in Familien üblich ist. Es gibt keine Altersgrenze, die jemand vorschreibt. Entscheiden Sie nach Ihrem Kind.",
     ]},
    {h: "Sätze zum Übernehmen",
     kurz: "Kurze Sätze für die Vereinbarung, die Druck herausnehmen und Verantwortung beim Kind lassen.",
     liste: [
      "„Wir versuchen zuerst selbst, dann fragen wir die KI, dann prüfen wir.“",
      "„Was du abgibst, erklärst du in eigenen Worten. Kannst du es nicht, hast du es noch nicht verstanden.“",
      "„Wenn die Lehrkraft etwas anderes sagt als wir hier aufgeschrieben haben, gilt die Lehrkraft.“",
      "„Wenn etwas schiefgeht, sprechen wir darüber und suchen eine Lösung. Du bekommst deswegen keinen Ärger.“",
      "„Nach vier Wochen schauen wir gemeinsam, was funktioniert hat, und ändern, was nicht passt.“",
     ]},
    {h: "Handy und Zeiten bei den Hausaufgaben",
     kurz: "SCHAU HIN! nennt als Beispiele für Regeln: Smartphone bei den Hausaufgaben ausgeschaltet. Technische Zeitbegrenzungen sollten nach und nach durch Absprachen abgelöst werden.",
     p: [
      "SCHAU HIN! nennt auf der Seite zu Bildschirmzeiten als Beispiele für gemeinsame Regeln, dass das Smartphone im Unterricht und bei den Hausaufgaben ausgeschaltet bleibt und beim gemeinsamen Essen keine Rolle spielt. Technische Zeitbegrenzungen empfiehlt die Seite zu Beginn, sie sollten aber nach und nach durch verbindliche Absprachen abgelöst werden. Mehr dazu: {{bildschirmzeit|Bildschirmzeit}}.",
      "Wie viel Zeit die Hausaufgaben mit KI brauchen dürfen, lässt sich nicht pauschal sagen. Legen Sie fest, wofür die KI genutzt wird. Eine feste Minutenzahl ist weniger wichtig.",
     ]},
    {h: "Zum Ausdrucken und Ausfüllen",
     kurz: "Das PDF oben hat Felder für alle sechs Bausteine, getrennt für 12 und 15 Jahre, mit Platz für zwei Unterschriften.",
     p: [
      "Das PDF zum Ausfüllen finden Sie oben auf dieser Seite. Setzen Sie sich mit Ihrem Kind hin, sprechen Sie jeden Baustein durch und tragen Sie gemeinsam ein, was gelten soll. Hängen Sie das Blatt sichtbar auf und legen Sie ein Datum fest, an dem Sie es überprüfen.",
      "Wenn Ihr Kind das Labor nutzt: Für Kinder unter 16 empfehlen wir, den Chat gemeinsam mit einer erwachsenen Person zu nutzen. Andere KI-Dienste haben eigene Altersgrenzen in ihren Nutzungsbedingungen. Lesen Sie sie, bevor Ihr Kind sie nutzt.",
     ]},
  ],
  mitnehmen: [
    "Eine kurze, gemeinsam ausgehandelte Vereinbarung hilft mehr als ein Verbot. Schreiben Sie sie auf.",
    "Sechs Bausteine: erlaubt, nicht erlaubt, kennzeichnen, prüfen, Zeiten, Streit. Mit 12 etwas enger geführt, mit 15 mit mehr Eigenverantwortung.",
    "Die Regeln der Schule gehen vor. Fragen Sie im Zweifel die Lehrkraft.",
  ],
  grenzen: [
    "Die Bausteine sind Vorschläge und kein Regelwerk. Sie sind keine pädagogische oder rechtliche Beratung.",
    "Die Altersangaben 12 und 15 sind Beispiele. Jedes Kind ist anders.",
  ],
  quiz: [
    {frage: "Ihre Tochter ist 12 und hat eine Hausaufgabe. Welche Regel passt zum Vorschlag?",
     optionen: ["Sie fragt die KI nach dem fertigen Aufsatz und gibt ihn ab", "Sie lässt sich etwas erklären und wird abgefragt, wenn Sie in der Nähe sind", "Sie nutzt KI, solange die Lehrkraft nichts ausdrücklich verboten hat", "Sie nutzt KI nur heimlich, damit es keinen Streit gibt"],
     richtig: 1, erklaerung: "Erklären und Abfragen lassen sich begleiten. Fertige Texte abzugeben nimmt dem Kind das Denken, und heimliche Nutzung widerspricht der Vereinbarung."},
    {frage: "Die Lehrkraft verlangt, KI-Hilfe anzugeben, die Vereinbarung zu Hause sagt nichts dazu. Was gilt?",
     optionen: ["Die Regel der Schule gilt, die Vereinbarung wird entsprechend ergänzt", "Die Vereinbarung zu Hause hat Vorrang vor den Vorgaben der Schule", "Es gilt, was das Kind selbst für richtig hält und möchte", "Es gilt keine der beiden Regeln, bis sich alle geeinigt haben"],
     richtig: 0, erklaerung: "Die Schule bestimmt, was bei Hausaufgaben gilt. Ergänzen Sie die Vereinbarung, damit beides zusammenpasst."},
    {frage: "Ihr Sohn ist 15 und will eine Regel ändern. Was ist ein guter Weg?",
     optionen: ["Die Regel bleibt, über Regeln wird nicht diskutiert", "Er ändert sie ohne Absprache, er ist alt genug", "Sie streichen die Vereinbarung ganz und vertrauen darauf", "Er nennt seine Gründe, und Sie passen die Regel gemeinsam an"],
     richtig: 3, erklaerung: "Regeln, die das Kind mit aushandelt, halten länger. Mit 15 wächst die Eigenverantwortung, und die Vereinbarung wächst mit."},
  ],
  weiter: ["ki-hausaufgaben-fair", "eltern-zuhause", "bildschirmzeit", "zusammen-ausprobieren", "quellen-pruefen"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Medienkompetenz", seiten: ["hausaufgaben-familie"] }],
});

/* Elternabend (Datei content-schule-medien.js, lädt davor): der Leitfaden nennt ein Kartenset, also stehen beide Sets als Download dabei.
   Ergänzt nur, was noch fehlt (nach Adresse), damit eine spätere Änderung der Datei nicht doppelt zählt. */
{
  const eb = INHALT.seiten["elternabend"];
  if (eb) {
    const dl = Array.isArray(eb.downloads) ? eb.downloads : (eb.downloads = []);
    for (const d of [
      {text: "Kartenset Echt oder KI? (Klasse)", sub: "12 Bildkarten, 2 Seiten A4, zum Ausschneiden, Auflösung im Lösungsblatt der Lehrkraft", href: "/static/materialien/bildkarten-echt-oder-ki.pdf"},
      {text: "Kartenset für zwei (Eltern)", sub: "4 Seiten A4 mit Auflösung und Spielregeln für zwei, zum Mitgeben", href: "/static/materialien/kartenset-eltern.pdf"},
    ]) if (!dl.some((x) => x && x.href === d.href)) dl.push(d);
  }
}

const NEU_SYN = {
  "hausaufgaben eltern": ["=hausaufgaben-familie", "=ki-hausaufgaben-fair", "=eltern-zuhause"],
  vereinbarung: ["=hausaufgaben-familie", "=bildschirmzeit", "=ki-hausaufgaben-fair"],
  familienvereinbarung: ["=hausaufgaben-familie", "=bildschirmzeit"],
  familie: ["=zusammen-ausprobieren", "=hausaufgaben-familie", "=eltern-zuhause", "=bildschirmzeit"],
  "12 jahre": ["=hausaufgaben-familie", "=bildschirmzeit", "=eltern-zuhause"],
  "15 jahre": ["=hausaufgaben-familie", "=bildschirmzeit", "=eltern-zuhause"],
  12: ["=hausaufgaben-familie", "=bildschirmzeit"],
  15: ["=hausaufgaben-familie", "=bildschirmzeit"],
  hausaufgaben: ["=ki-hausaufgaben-fair", "=hausaufgaben-familie", "=prompts-schule"],
  hausaufgabe: ["=ki-hausaufgaben-fair", "=hausaufgaben-familie", "=prompts-schule"],
};
for (const [k, ids] of Object.entries(NEU_SYN)) INHALT.synonyme[k] = [...new Set([...ids, ...(INHALT.synonyme[k] || [])])];
})();
