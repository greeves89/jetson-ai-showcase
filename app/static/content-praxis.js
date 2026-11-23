/* Seite "KI in der Arztpraxis" (Gruppe KI im Betrieb) für Praxen, Zahnärztinnen und Zahnärzte, Therapeutinnen und Therapeuten.
   Nur belegbare Aussagen, alle Quellen am 23.11.2026 abgerufen: § 203 StGB (gesetze-im-internet.de), Art. 9, 28 und 35 DSGVO
   (dsgvo-gesetz.de, Wortlaut der Verordnung (EU) 2016/679 auf eur-lex.europa.eu), Hinweise von Bundesärztekammer und KBV
   (bundesaerztekammer.de), Liste der Aufsichtsbehörden (bfdi.bund.de). Kein Rechtsrat. Beispiele und Texte sind erfunden. */
(function () {

const S = {};

S["praxis-gesundheit"] = {
  nav: "KI in der Arztpraxis", typ: "lektion", gruppe: "KI im Betrieb", titel: "KI in der Arztpraxis: was geht, was nicht", symbol: "stethoscope", rollen: ["beruf", "betrieb"],
  downloads: [{text: "Entscheidungshilfe für den Betrieb", sub: "1 Seite A4 mit Kästchen und Notizfeld, zum Abhaken", href: "/static/materialien/entscheidungshilfe-betrieb.pdf"}],
  lernziele: [
    "Du kannst vier Aufgaben im Praxisalltag nennen, bei denen KI hilft, ohne dass ein Patient im Text vorkommt.",
    "Du kannst sagen, warum Patientendaten nicht in eine Cloud-KI gehören, und was dafür geklärt sein müsste.",
    "Du kannst die Begriffe Schweigepflicht (§ 203 StGB), besondere Kategorien (Art. 9 DSGVO) und Auftragsverarbeitung (Art. 28 DSGVO) einordnen.",
  ],
  kurz: "Für Praxen, Zahnärzte und Therapeuten: Was KI im Alltag bringen kann, was nicht in eine Cloud-KI gehört und was Schweigepflicht und DSGVO verlangen. Kein Rechtsrat.",
  zusammenfassung: "KI kann in der Praxis bei Texten helfen, die keine Patientendaten enthalten: Vorlagen für Terminerinnerungen, allgemeine Briefe, Texte für die Website, Prüfschemata für die Abrechnung an erfundenen Fällen. Patientendaten gehören nicht in eine Cloud-KI: Die Schweigepflicht nach § 203 StGB, Gesundheitsdaten als besondere Kategorie nach Art. 9 DSGVO und die Pflicht zum Vertrag mit Dienstleistern nach Art. 28 DSGVO setzen enge Grenzen. Hinweise zur Datenschutz-Folgenabschätzung und zur Aufsichtsbehörde. Kein Rechtsrat.",
  abschnitte: [
    {h: "Was KI in der Praxis bringen kann",
     kurz: "KI schreibt Entwürfe: Erinnerungstexte, allgemeine Briefe, Website-Texte, Prüfschemata für die Abrechnung an erfundenen Fällen. Kein Patient kommt im Text vor.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "calendar", text: "Termine und Recall", sub: "Vorlagen mit Platzhaltern"},
      {icon: "mail", text: "Schriftverkehr", sub: "ohne Patientendaten"},
      {icon: "calculator", text: "Abrechnung vorbereiten", sub: "an erfundenen Fällen üben"},
      {icon: "globe", text: "Texte für die Website", sub: "Entwurf, du prüfst"}]},
     p: [
      "Ein Sprachmodell schreibt Entwürfe. In der Praxis eignet es sich dort, wo der Text ohne einen echten Patienten auskommt. Das sind vier typische Aufgaben:",
     ],
     liste: [
      "**Termine und Recall:** Die KI formuliert eine freundliche Erinnerung mit Platzhaltern wie [NAME] und [TERMIN]. Die echten Namen setzt deine Praxissoftware ein, nicht die KI.",
      "**Schriftverkehr ohne Patientendaten:** Anfragen an Lieferanten, Stellenanzeigen, Hinweisschilder, Informationsbriefe an alle, Antwort auf eine Bewertung ohne Fallbezug.",
      "**Abrechnung vorbereiten, mit erfundenen Daten:** Du lässt dir an ausgedachten Fällen ein Prüfschema oder eine Checkliste entwerfen. Echte Fälle bleiben in der Abrechnungssoftware.",
      "**Texte für die Website:** Eine Leistungsbeschreibung oder Antworten auf häufige Fragen. Fachlich prüfst du jeden Satz selbst, denn das Modell erfindet manchmal Angaben.",
     ],
     code: [{titel: "Beispiel: Erinnerungstext mit Platzhaltern (ohne Patientendaten)", text: "Schreibe eine freundliche, kurze Erinnerung für Patientinnen und Patienten einer Zahnarztpraxis, die länger als ein Jahr nicht zur Kontrolle waren. Verwende die Platzhalter [NAME] und [TERMIN]. Keine medizinischen Aussagen, maximal 60 Wörter, Sie-Form."}],
     alltag: "Eine Zahnarztpraxis lässt sich einmal einen Erinnerungstext mit Platzhaltern schreiben. Die Praxissoftware setzt Name und Termin ein und versendet. Die KI hat nie einen Namen gesehen. Der Entwurf wird gelesen, gekürzt und freigegeben, bevor er rausgeht.",
     merke: "In allen vier Aufgaben kommt kein Patient im Text vor. Das ist die Bedingung."},
    {h: "Was nicht hineingehört",
     kurz: "Namen mit Befund, Röntgenbilder, Anamnese, Terminlisten mit Namen und echte Abrechnungsfälle gehören nicht in eine Cloud-KI und nicht in dieses Labor.",
     visual: {typ: "vergleich",
      links: {titel: "Geht", icon: "circle-check", farbe: "gruen", punkte: ["Vorlage mit Platzhaltern", "Erfundener Beispielfall", "Allgemeiner Informationstext"]},
      rechts: {titel: "Geht nicht", icon: "ban", farbe: "rot", punkte: ["Name mit Befund", "Röntgenbild oder Foto", "Terminliste mit Namen"]}},
     p: [
      "Alles, was auf einen Patienten schließen lässt, behandelst du wie ein anvertrautes Geheimnis: Name, Geburtsdatum, Befund, Anamnese, Bilder, auch ein Termin mit einer Diagnose. Ob ein Name allein schon darunter fällt, entscheidet nicht diese Seite. Wer sicher gehen will, lässt solche Angaben weg.",
      "Dieses Labor ist dafür nicht gedacht. Es ist ein kostenloses Lernangebot ohne Vertrag zur Auftragsverarbeitung. Die Eingaben laufen auf dem Weg zum Rechner über Vermittler (ein Server bei IONOS und der Tunneldienst von Cloudflare). Der Rechner speichert sie nicht, aber der Weg ist kein Praxisweg. Die Einzelheiten stehen auf {{sicherheit-einfach|Ist das sicher?}}.",
      "Bei Cloud-KI-Diensten kommt dazu: Du musst vorher wissen, ob Eingaben gespeichert oder zum Training verwendet werden und wo sie verarbeitet werden. Das steht in den Vertragsbedingungen des Anbieters, nicht im Werbetext.",
     ],
     merke: "Im Zweifel: erfundener Fall statt echtem Fall."},
    {h: "Schweigepflicht: § 203 StGB",
     kurz: "Wer als Arzt, Zahnarzt oder Angehöriger eines anderen Heilberufs ein anvertrautes Geheimnis unbefugt offenbart, kann sich strafbar machen. Dienstleister müssen zur Geheimhaltung verpflichtet sein.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "lock", text: "Anvertraut", sub: "Geheimnis des Patienten"},
      {icon: "triangle-alert", text: "Unbefugt offenbart", sub: "auch an Dienstleister", farbe: "orange"},
      {icon: "scale", text: "Strafbar", sub: "bis ein Jahr oder Geldstrafe", farbe: "rot"}]},
     p: [
      "§ 203 Absatz 1 Nummer 1 StGB nennt Ärzte, Zahnärzte, Tierärzte, Apotheker und Angehörige anderer Heilberufe mit staatlich geregelter Ausbildung. Wer ein fremdes Geheimnis, das ihm anvertraut oder sonst bekannt geworden ist, unbefugt offenbart, kann mit Freiheitsstrafe bis zu einem Jahr oder mit Geldstrafe bestraft werden. Weitere Nummern des Absatzes nennen weitere Berufsgruppen. Ob dein Beruf gemeint ist, liest du im Gesetz nach oder fragst deine Kammer.",
      "Absatz 3 erlaubt, dass Geheimnisse an Gehilfen und an sonstige an der Tätigkeit mitwirkende Personen gehen, soweit das für deren Mitwirkung erforderlich ist. Absatz 4 Nummer 1 bestraft den Berufsgeheimnisträger, der nicht dafür sorgt, dass eine mitwirkende Person zur Geheimhaltung verpflichtet wird. Ein KI-Dienst, an den du Patientendaten gibst, ist ein solcher Dienstleister. Ohne Verpflichtung zur Geheimhaltung ist das heikel.",
     ],
     alltag: "Eine Praxis gibt einer externen Schreibkraft Befunde zum Abtippen. Dafür braucht sie eine Verpflichtung zur Geheimhaltung. Für einen KI-Dienst gilt dasselbe, nur dass dort oft niemand weiß, wer alles Zugriff hat."},
    {h: "Gesundheitsdaten: Art. 9 DSGVO",
     kurz: "Gesundheitsdaten sind besondere Kategorien personenbezogener Daten. Ihre Verarbeitung ist grundsätzlich untersagt, Ausnahmen gibt es unter Bedingungen, etwa für die Behandlung.",
     p: [
      "Art. 9 Absatz 1 DSGVO untersagt die Verarbeitung von Gesundheitsdaten und anderen besonderen Kategorien, etwa genetischen oder biometrischen Daten zur eindeutigen Identifizierung. Absatz 2 lässt Ausnahmen zu. Buchstabe h betrifft die Verarbeitung für Zwecke der Gesundheitsvorsorge, der medizinischen Diagnostik sowie der Versorgung oder Behandlung im Gesundheitsbereich, auf der Grundlage von Unionsrecht oder dem Recht eines Mitgliedstaats oder aufgrund eines Vertrags mit einem Angehörigen eines Gesundheitsberufs, mit den Bedingungen und Garantien aus Absatz 3.",
      "Das erlaubt die Behandlung und ihre Verwaltung. Ob die Ausnahme auch trägt, wenn ein KI-Dienst die Daten verarbeitet, ist eine Rechtsfrage für deine Datenschutzbeauftragte oder die Aufsichtsbehörde, nicht für diese Seite.",
     ]},
    {h: "Auftragsverarbeitung: Art. 28 DSGVO",
     kurz: "Verarbeitet ein Dienstleister Daten in deinem Auftrag, braucht es einen Vertrag. Er regelt unter anderem, dass der Dienstleister nur auf deine dokumentierte Weisung arbeitet.",
     p: [
      "Wer eine Verarbeitung im Auftrag vergibt, arbeitet nach Art. 28 Absatz 1 DSGVO nur mit Auftragsverarbeitern, die hinreichend Garantien für geeignete technische und organisatorische Maßnahmen bieten. Die Verarbeitung erfolgt nach Absatz 3 auf der Grundlage eines Vertrags, der unter anderem festlegt, dass der Dienstleister die Daten nur auf dokumentierte Weisung verarbeitet und dass sich die befugten Personen zur Vertraulichkeit verpflichtet haben.",
      "Für eine Praxis heißt das: Ein kostenloses Konto bei einem KI-Dienst ersetzt keinen solchen Vertrag. Ohne ihn gehen keine Patientendaten hinein.",
     ]},
    {h: "Datenschutz-Folgenabschätzung und Aufsichtsbehörde",
     kurz: "Bei umfangreicher Verarbeitung besonderer Kategorien kann eine Folgenabschätzung nötig sein. Das klärst du mit der Datenschutzbeauftragten. Die Aufsicht ist Ländersache.",
     p: [
      "Art. 35 Absatz 1 DSGVO verlangt eine Abschätzung der Folgen vorab, wenn eine Verarbeitung, besonders mit neuen Technologien, voraussichtlich ein hohes Risiko für die Rechte und Freiheiten natürlicher Personen hat. Nach Absatz 3 Buchstabe b ist sie insbesondere bei umfangreicher Verarbeitung besonderer Kategorien nach Art. 9 Absatz 1 erforderlich. Ob das für deine Praxis zutrifft, hängt von Art und Umfang ab. Das ist ein Fall für die Datenschutzbeauftragte.",
      "Zuständig für die Aufsicht sind in der Regel die Datenschutzbehörden der Länder. Die Liste mit allen 16 steht beim Bundesbeauftragten für den Datenschutz: [Liste der Aufsichtsbehörden](https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html). Bundesärztekammer und KBV haben gemeinsame Hinweise zur ärztlichen Schweigepflicht und zum Datenschutz in der Arztpraxis veröffentlicht (zuletzt umfassend aktualisiert im Oktober 2025), auf der Seite [Datenschutzrecht der Bundesärztekammer](https://www.bundesaerztekammer.de/recht/datenschutzrecht/). Ob und wie dort KI behandelt wird, lies im Dokument selbst nach.",
     ]},
    {h: "Dein nächster Schritt",
     kurz: "Zum Abhaken: die sechs Fragen der Entscheidungshilfe. Frage 3 steht für Daten und Rechtsgrundlage.",
     p: [
      "Die {{betrieb-entscheidung|Entscheidung: sechs Fragen vor dem Start}} führt dich durch die Fragen, die vor jedem Einsatz geklärt sein sollten. Als Blatt zum Ausdrucken gibt es die Entscheidungshilfe oben auf dieser Seite. Beispiele für Betriebe mit Schweigepflicht stehen auf {{uc-buero-dokumente|Fragen an Dokumente}} (Steuerbüro, erfundene Daten) und auf {{recht|Recht und Regeln}}.",
      "Diese Seite ist keine Rechtsberatung. Lass den Einsatz von Datenschutzbeauftragter, Kammer oder einer Anwältin prüfen, bevor echte Patientendaten in ein KI-System gehen.",
     ]},
    {h: "Quellen",
     kurz: "Alle Quellen am 23.11.2026 abgerufen.",
     liste: [
      "[§ 203 StGB, Verletzung von Privatgeheimnissen](https://www.gesetze-im-internet.de/stgb/__203.html), gesetze-im-internet.de, abgerufen am 23.11.2026.",
      "[Art. 9 DSGVO, Verarbeitung besonderer Kategorien personenbezogener Daten](https://dsgvo-gesetz.de/art-9-dsgvo/), abgerufen am 23.11.2026.",
      "[Art. 28 DSGVO, Auftragsverarbeiter](https://dsgvo-gesetz.de/art-28-dsgvo/), abgerufen am 23.11.2026.",
      "[Art. 35 DSGVO, Datenschutz-Folgenabschätzung](https://dsgvo-gesetz.de/art-35-dsgvo/), abgerufen am 23.11.2026. Der amtliche Wortlaut der Verordnung (EU) 2016/679 steht auf [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679).",
      "Bundesärztekammer und KBV: [Hinweise und Empfehlungen zur ärztlichen Schweigepflicht, Datenschutz und Datenverarbeitung in der Arztpraxis](https://www.bundesaerztekammer.de/recht/datenschutzrecht/), Stand Oktober 2025, abgerufen am 23.11.2026.",
      "Bundesbeauftragter für den Datenschutz: [Liste der Aufsichtsbehörden der Länder](https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html), abgerufen am 23.11.2026.",
     ]},
  ],
  mitnehmen: [
    "KI hilft bei Texten ohne Patientendaten: Vorlagen mit Platzhaltern, allgemeine Briefe, Website-Texte, Prüfschemata an erfundenen Fällen.",
    "Patientendaten gehören nicht in eine Cloud-KI und nicht in dieses Labor. Schweigepflicht (§ 203 StGB), Art. 9 und Art. 28 DSGVO setzen die Grenze.",
    "Ob ein Einsatz mit echten Daten möglich ist, klären Datenschutzbeauftragte und Kammer vorher. Diese Seite ist kein Rechtsrat.",
  ],
  grenzen: [
    "Kein Rechtsrat. Die Seite ordnet Begriffe ein und nennt Quellen. Ob und wie du KI mit Patientendaten einsetzen darfst, klärst du mit Datenschutzbeauftragter, Kammer oder Anwältin.",
    "Das kleine Modell dieses Labors erfindet manchmal Angaben. Medizinische Aussagen prüfst du immer selbst.",
    "Die Beispiele sind erfunden. Berufsgruppen und Fristen können sich ändern, lies im Zweifel die aktuelle Fassung des Gesetzes.",
  ],
  quiz: [
    {frage: "Eine Praxis will Erinnerungen an Patienten verschicken. Was ist ohne Vertrag mit einem KI-Anbieter unbedenklich?",
     optionen: ["Die Terminliste mit allen Namen in den Chat einfügen", "Einen Entwurf mit Platzhaltern wie [NAME] und [TERMIN] schreiben lassen", "Die Anamnesebögen als Beispiel für den Tonfall hochladen", "Die Patientenakten zusammenfassen, solange der Chat gratis ist"],
     richtig: 1, erklaerung: "Ein Entwurf mit Platzhaltern enthält keinen Patienten. Die Namen setzt die Praxissoftware ein. In allen anderen Fällen gehen Patientendaten an einen Dienstleister."},
    {frage: "Welche Aussage zu § 203 StGB trifft zu?",
     optionen: ["Er gilt nur für Ärzte in Krankenhäusern und nicht für niedergelassene Praxen", "Er verbietet jede Weitergabe, auch an die Gehilfen der eigenen Praxis selbst", "Er erlaubt mitwirkende Personen, wenn sie zur Geheimhaltung verpflichtet werden", "Er betrifft nur Daten, die der Patient ausdrücklich als geheim bezeichnet hat"],
     richtig: 2, erklaerung: "Absatz 1 nennt Ärzte, Zahnärzte und weitere Heilberufe. Absatz 3 erlaubt die Einbindung mitwirkender Personen, soweit erforderlich, und Absatz 4 verlangt, dass sie zur Geheimhaltung verpflichtet werden."},
    {frage: "Warum reicht ein kostenloses Konto bei einem KI-Dienst für Patientendaten nicht aus?",
     optionen: ["Gesundheitsdaten sind besonders geschützt, und ein Dienstleister braucht einen Vertrag", "Kostenlose Konten arbeiten technisch langsamer als die bezahlten Konten", "Gesundheitsdaten dürfen nach der DSGVO grundsätzlich nur auf Papier liegen", "Die Aufsichtsbehörde prüft ausschließlich bezahlte Dienste und keine kostenlosen"],
     richtig: 0, erklaerung: "Art. 9 DSGVO schützt Gesundheitsdaten besonders, und Art. 28 verlangt für die Verarbeitung im Auftrag einen Vertrag. Ein Konto allein ist keiner."},
  ],
  weiter: ["betrieb-entscheidung", "sicherheit-einfach", "uc-buero-dokumente", "recht", "ki-einfuehrung"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "KI im Betrieb", seiten: ["praxis-gesundheit"] }],
});

/* Suchwörter (Schlüssel ohne Umlaute, siehe content-laien.js): Berufe, Alltagswörter und Rechtsbegriffe führen zur Seite */
const NEU_SYN = {
  zahnarzt: ["=praxis-gesundheit", "=betrieb-entscheidung", "=sicherheit-einfach"],
  zahnaerztin: ["=praxis-gesundheit", "=betrieb-entscheidung", "=sicherheit-einfach"],
  zahnarztpraxis: ["=praxis-gesundheit", "=betrieb-entscheidung", "=sicherheit-einfach"],
  arzt: ["=praxis-gesundheit", "=betrieb-entscheidung", "=sicherheit-einfach"],
  aerztin: ["=praxis-gesundheit", "=betrieb-entscheidung", "=sicherheit-einfach"],
  arztpraxis: ["=praxis-gesundheit", "=betrieb-entscheidung", "=sicherheit-einfach"],
  praxis: ["=praxis-gesundheit", "=betrieb-entscheidung", "=sicherheit-einfach"],
  patienten: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung"],
  patient: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung"],
  patientendaten: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung", "=recht"],
  gesundheit: ["=praxis-gesundheit", "=sicherheit-einfach", "=uc-gesundheit-auffaellig"],
  gesundheitsdaten: ["=praxis-gesundheit", "=sicherheit-einfach", "=recht"],
  therapeut: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung"],
  therapeutin: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung"],
  psychotherapeut: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung"],
  physiotherapie: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung"],
  schweigepflicht: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung", "=recht"],
  berufsgeheimnis: ["=praxis-gesundheit", "=sicherheit-einfach", "=betrieb-entscheidung", "=recht"],
  entscheidungshilfe: ["=betrieb-entscheidung", "=praxis-gesundheit", "=ki-einfuehrung"],
  mandanten: ["=sicherheit-einfach", "=praxis-gesundheit", "=betrieb-entscheidung", "=uc-buero-dokumente", "=recht"],
  "datenschutz praxis": ["=praxis-gesundheit", "=sicherheit-einfach", "=recht"],
  "art 9": ["=praxis-gesundheit", "=sicherheit-einfach", "=recht"],
  recall: ["=praxis-gesundheit"],
  terminerinnerung: ["=praxis-gesundheit"],
  folgenabschaetzung: ["=praxis-gesundheit", "=recht"],
  auftragsverarbeitung: ["=praxis-gesundheit", "=sicherheit-einfach", "=recht"],
};
for (const [k, ids] of Object.entries(NEU_SYN)) INHALT.synonyme[k] = [...new Set([...ids, ...(INHALT.synonyme[k] || [])])];
})();
