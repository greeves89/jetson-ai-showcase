# Videoskizzen: Strang Schule und Medienkompetenz

Sechs Folgen, je 130 bis 150 Sekunden (Rückmeldung der Prüfer: die bisherigen 62 bis 89 Sekunden waren ein wenig zu kurz). Zielgruppe 13 bis 18 Jahre. Sprechtext in Du-Form, kurze Sätze, Bilder zuerst, Humor erlaubt, kein erhobener Zeigefinger. Machart wie in `docs/videos-grundlagen.md`: dunkler Grund, wenige Farben, Symbole im lucide-Stil, abgezeichnete Beispielbilder (keine Fotos, keine echten Personen, keine Marken). Keine Kunden-, Firmen- oder Personennamen. Quelle der Sprechtexte: `videos/texte/<id>.json`, dort stehen die Sätze je Szene; diese Datei ist daraus erzeugt.

## Übersicht und Einbindung

Die Einbindung macht der Hauptprozess. Je Lektionsseite in `app/static/content-medien.js` das Feld `videos: ["<id>"]` ergänzen (Seiten-ID und Video-ID sind gleich). Die Datei `app/static/videos/manifest.json` enthält die sechs neuen Einträge bereits (von `stimme.mjs` geschrieben), Kapitelsprünge kommen daraus.

| Video-Id = Seiten-ID | Datei (app/static/videos/) | Dauer | Größe | Kapitel | Neue Zeichen (ElevenLabs) |
|---|---|---|---|---|---|
| `echt-oder-ki` | `echt-oder-ki.mp4`, `echt-oder-ki.jpg`, `echt-oder-ki.vtt` | 2:31 (151.1 s) | 6.9 MB | 9 | 1938 |
| `quellen-pruefen` | `quellen-pruefen.mp4`, `quellen-pruefen.jpg`, `quellen-pruefen.vtt` | 2:29 (149.3 s) | 7.2 MB | 9 | 1846 |
| `fake-news-deepfakes` | `fake-news-deepfakes.mp4`, `fake-news-deepfakes.jpg`, `fake-news-deepfakes.vtt` | 2:26 (145.7 s) | 7.9 MB | 9 | 1999 |
| `ki-hausaufgaben-fair` | `ki-hausaufgaben-fair.mp4`, `ki-hausaufgaben-fair.jpg`, `ki-hausaufgaben-fair.vtt` | 2:12 (131.8 s) | 6.9 MB | 9 | 1704 |
| `datenschutz-im-alltag` | `datenschutz-im-alltag.mp4`, `datenschutz-im-alltag.jpg`, `datenschutz-im-alltag.vtt` | 2:18 (138.1 s) | 7.7 MB | 9 | 1857 |
| `prompts-fuer-schueler` | `prompts-fuer-schueler.mp4`, `prompts-fuer-schueler.jpg`, `prompts-fuer-schueler.vtt` | 2:14 (133.6 s) | 7.5 MB | 10 | 1712 |

Gesamt neue Zeichen für die sechs Folgen: 11056.

## `echt-oder-ki` (Seite `echt-oder-ki`)

Titel: Echt oder KI?  
Untertitel: So gehst du mit Bildern um, die zu gut aussehen  
Kernaussage: Das Auge reicht nicht mehr. Wer ein Bild beurteilt, fragt nach Herkunft und zweiter Quelle, nicht nur nach Fehlern im Bild.  
Dauer: 151 Sekunden.

1. Bild (Zwei Bilder): Zwei Berglandschaften, nebeneinander, mit A und B beschriftet. Über beiden ein großes Fragezeichen, ein Kamera-Symbol und ein Funken-Symbol (KI) wechseln zwischen den Bildern. Sprechtext: „Zwei Bilder von einem Berg. Eins hat eine Kamera gemacht, eins eine KI.“ „Welches ist welches? Tipp kurz, bevor du weiterhörst.“
2. Bild (Bauchgefühl): Beide Bilder sehen gleich echt aus. Ein Messgerät mit wackelnder Nadel, Beschriftung Bauchgefühl, daneben eine Münze, die sich dreht. Sprechtext: „Und genau das ist das Problem. Studien zeigen, dass Menschen KI-Gesichter oft nicht sicher von echten unterscheiden.“ „Dein Bauchgefühl ist also kein Messgerät.“
3. Bild (Fehler im Bild): Drei Karten nacheinander: Hand mit sechs Fingern, Schild mit Buchstabensuppe, Gegenstand mit Schatten in die falsche Richtung. Zu jeder ein roter Kreis. Sprechtext: „Früher halfen Fehler im Bild. Hände mit zu vielen Fingern, Schrift wie Buchstabensuppe, Schatten, die in die falsche Richtung fallen.“ „Schau trotzdem hin. Das sind gute erste Hinweise.“
4. Bild (Die Modelle lernen): Drei Balken über die Zeit: sichtbare Fehler werden Jahr für Jahr kürzer, bis der Balken fast verschwindet. Ein Kalender-Symbol. Sprechtext: „Aber die Modelle lernen dazu. Was heute auffällt, ist bald weg.“ „Ein Bild ohne sichtbaren Fehler ist deshalb noch lange kein echtes Bild.“
5. Bild (Woher kommt es?): Ein Bild in der Mitte, drei Fragen als Karten darum: Wer zeigte es zuerst? Wann? Wo? Ein Pfeil zurück zur Quelle. Sprechtext: „Dreh die Frage um. Nicht: Sieht das echt aus? Sondern: Woher kommt das?“ „Wer hat es zuerst gezeigt? Gibt es dazu ein Datum, einen Ort, einen Namen?“ „Ein Bild ohne Herkunft ist wie eine Behauptung ohne Beweis.“
6. Bild (Echt, aber falsch): Links ein Foto mit Beschriftung vor Jahren, rechts dieselbe Karte mit Schlagzeile Heute! und einem roten Stempel Falscher Zusammenhang. Sprechtext: „Und noch etwas: Nicht jedes falsche Bild kommt von einer KI. Oft ist es ein echtes Foto mit falscher Geschichte.“ „Ein altes Foto, das als neues Ereignis verkauft wird. Darum zählt die Herkunft mehr als die Technik.“
7. Bild (Bildersuche): Ein Bild wandert in ein Suchfeld mit Lupe, rechts erscheint eine Trefferliste mit drei kleinen Bildern und Jahreszahlen, eins davon deutlich älter. Sprechtext: „Mit der Bildersuche siehst du, wo ein Bild sonst noch auftaucht. Lade es hoch oder gib die Adresse ein.“ „Oft zeigt sich: Das Bild ist alt, geklaut oder gehört zu einer ganz anderen Geschichte.“ „Findest du es nirgends, ist das ein Warnsignal, aber kein Beweis.“
8. Bild (Herkunftsangabe): Ein Bild mit einem Siegel-Symbol (Haken im Schild) und der Beschriftung Content Credentials. Daneben ein Bild ohne Siegel mit Fragezeichen. Eine Erkennungs-App mit wackelnder Anzeige. Sprechtext: „Manche Programme speichern eine Herkunftsangabe im Bild. Sie heißt Content Credentials und zeigt, womit das Bild entstanden ist.“ „Ist sie da, hilft das. Fehlt sie, heißt das nichts, denn sie geht zum Beispiel bei einem Bildschirmfoto verloren.“ „Und Apps, die KI-Bilder erkennen sollen, liegen auch oft daneben.“
9. Bild (Dein Plan): Drei große Karten mit Nummern: Wer zeigt mir das? Was soll ich fühlen oder tun? Gibt es eine zweite Quelle? Darunter ein durchgestrichener Weiterleiten-Pfeil. Sprechtext: „Dein Plan in drei Fragen. Wer zeigt mir das? Was soll ich dabei fühlen oder tun? Gibt es eine zweite Quelle?“ „Achte auch darauf, was das Bild mit dir macht. Macht es dich sofort wütend? Dann sei besonders vorsichtig, denn an Gefühlen ziehen Fakes am liebsten.“ „Bist du danach unsicher, schick es nicht weiter. Zweifeln ist erlaubt, und es macht dich nicht langweilig.“

Belege und Hinweise:
- Studien zu KI-erzeugten Gesichtern (unter anderem Nightingale und Farid, PNAS, 2022): Versuchspersonen unterschieden sie nicht sicher von echten.
- Content Credentials: offener Herkunftsstandard der Coalition for Content Provenance and Authenticity (C2PA). Die Angabe steckt in den Metadaten und geht zum Beispiel bei einem Bildschirmfoto verloren.
- KI-Erkennungsprogramme: Ein Anbieter nahm sein Textwerkzeug 2023 wegen geringer Trefferquote vom Netz (steht so auch auf der Lektionsseite). Für Bilder gilt dasselbe vorsichtig: kein sicherer Beweis.

## `quellen-pruefen` (Seite `quellen-pruefen`)

Titel: Quellen prüfen  
Untertitel: Fünf Schritte, bevor du etwas glaubst oder weiterschickst  
Kernaussage: Wer eine Quelle prüft, fragt: Wer steckt dahinter, was sagen andere über sie, gibt es eine zweite Quelle, und was steht im Original?  
Dauer: 149 Sekunden.

1. Bild (Tausend Likes): Ein Handy mit einem Beitrag: große Überschrift, ein Daumen-Symbol mit einem hochzählenden Zähler. Daneben ein Gruppenchat, in dem dieselbe Nachricht dreimal ankommt. Sprechtext: „Dein Chat explodiert. Alle schicken denselben Beitrag, mit großer Überschrift und tausend Likes.“ „Stimmt das? Likes sind kein Beweis. Auch Unsinn kann tausendmal geteilt werden.“
2. Bild (Schritt 1: Stopp): Ein rotes Stoppschild-Symbol, davor ein Teilen-Pfeil, der abgebremst wird. Zwei Gesichter-Symbole: wütend und neugierig, beide ziehen am Teilen-Knopf. Sprechtext: „Schritt eins heißt Stopp. Bevor du glaubst oder teilst, atme einmal durch.“ „Beiträge, die wütend oder neugierig machen, verbreiten sich besonders gut. Manche sind genau dafür gebaut.“
3. Bild (Schritt 2: Wer steckt dahinter?): Eine Webseite im Rahmen, unten ein Link Impressum, der markiert wird. Daneben ein Konto-Profil mit Fragezeichen. Sprechtext: „Schritt zwei: Wer steckt dahinter? Schau, ob die Seite sagt, wer sie betreibt.“ „Ein Impressum mit Name und Adresse ist ein gutes Zeichen. Fehlt es ganz, sei misstrauisch.“
4. Bild (Schritt 3: Seitlich lesen): Ein Browserfenster, daneben öffnen sich zwei neue Tabs, in einem steht der Name der Quelle in einer Suchzeile. Pfeil nach rechts. Sprechtext: „Schritt drei: Lies seitlich. Verlass die Seite und öffne einen neuen Tab. Such nach dem Namen der Quelle.“ „Was sagen andere über sie? So arbeiten Profis, die Fakten prüfen.“
5. Bild (Schritt 4: Zweite Quelle): Eine Aussage in der Mitte. Drei Quellen-Symbole (Zeitung, Behörde, Nachrichtenagentur) mit Haken, ein einsames Symbol mit Warnzeichen. Sprechtext: „Schritt vier: Gibt es eine zweite Quelle? Berichten unabhängige Medien dasselbe, oder eine Behörde?“ „Hat nur eine einzige Seite die große Neuigkeit, ist das ein Warnzeichen.“
6. Bild (Schritt 5: Zum Original): Stille Post: vier Figuren in einer Reihe, der Satz wird bei jeder Figur kürzer und verdrehter. Am Ende ein Dokument mit Lupe: Originalstudie. Sprechtext: „Schritt fünf: Geh zum Original. Wie bei Stille Post wird eine Studie auf dem Weg oft verdreht.“ „Such die Studie selbst. Steht dort wirklich, was der Beitrag behauptet? Und wer hat sie bezahlt?“
7. Bild (Probelauf): Eine Meldungskarte: Neue Studie, Schüler mit blauen Stiften schreiben bessere Noten. Fünf Prüfzeilen mit Haken oder Kreuz erscheinen nacheinander, am Ende ein roter Stempel Erfunden. Sprechtext: „Ein Probelauf mit einer erfundenen Meldung: Schüler mit blauen Stiften schreiben bessere Noten.“ „Stopp: Das klingt zu schön, um wahr zu sein. Wer steckt dahinter? Eine Seite ohne Impressum. Seitlich gelesen: Niemand kennt sie.“ „Zweite Quelle? Keine. Original? Keine Studie zu finden. Ergebnis: Quatsch, und du hast es in zwei Minuten gemerkt.“
8. Bild (Und die KI?): Ein Chat: Nutzer fragt nach Beleg, KI antwortet mit einem Link, der Link führt zu einer Seite Nicht gefunden. Ein rotes Kreuz. Sprechtext: „Und die KI? Ein Chatbot ist keine Quelle. Er setzt Wörter fort, die passen, und kann Quellen erfinden.“ „Bitte ihn um Links und klick sie an. Gibt es die Seite nicht, hat er sie erfunden.“ „Hilfreich ist er trotzdem: für Ideen, was du prüfen kannst.“
9. Bild (Dein Merksatz): Fünf Kacheln in einer Reihe mit Symbolen und Stichwörtern: Stopp, Wer, Seitlich, Zweite Quelle, Original. Darunter ein Haken. Sprechtext: „Dein Merksatz: Stopp, wer, seitlich, zweite Quelle, Original.“ „Das dauert ein paar Minuten und macht dich zum Profi im Freundeskreis.“ „Und wenn du nichts findest? Dann teile es nicht. Das ist völlig in Ordnung.“

Belege und Hinweise:
- Seitwärts lesen: Beobachtungen der Stanford History Education Group zu Faktenprüfern (2017 bis 2019), wie auf der Lektionsseite genannt.
- Impressum: Anbieter von Telemedien in Deutschland müssen sich im Regelfall zu erkennen geben (Impressumspflicht). Das Video sagt deshalb nur: Impressum ist ein gutes Zeichen, Fehlen ein Warnsignal.
- Die Beispielmeldung (blaue Stifte) und die Webadresse mit Endung .example sind frei erfunden und als unbedenkliche Beispieladresse gewählt.

## `fake-news-deepfakes` (Seite `fake-news-deepfakes`)

Titel: Fake News und Deepfakes  
Untertitel: Was dahinter steckt und wie du dich schützt  
Kernaussage: Falsches verbreitet sich durch Teilen. Deepfakes machen Bild, Ton und Video unsicher. Hilfreich sind Kontext, Rückruf, Codewort und Zurückhaltung beim Teilen.  
Dauer: 146 Sekunden.

1. Bild (Die Sprachnachricht): Ein Handy mit Sprachnachricht von Bruder, Klangwelle. Eine Stimmen-Maske-Animation: die Klangwelle wird von einer KI-Maschine erzeugt. Textzeile: Überweis mir schnell Geld. Sprechtext: „Stell dir vor: Eine Sprachnachricht von deinem Bruder. Er klingt gestresst und bittet dich, schnell Geld zu schicken.“ „Es klingt echt. Aber er hat sie nie aufgenommen. Eine KI hat seine Stimme nachgebaut.“
2. Bild (Zwei Begriffe): Zwei Kästen: links aus Versehen falsch (Fehlinformation), rechts mit Absicht falsch (Desinformation). Darüber der Sammelbegriff Fake News. Sprechtext: „Zwei Begriffe, die oft vermischt werden. Eine Fehlinformation ist falsch und wird aus Versehen weitergegeben.“ „Desinformation ist absichtlich falsch. Fake News nennt man beides im Alltag.“ „Wichtig: Wer teilt, macht mit, auch ohne Absicht.“
3. Bild (Warum das jemand tut): Drei Symbole mit Beschriftung: Münze (Geld mit Klicks), Megafon (Meinung machen), Lachgesicht (Spaß). Darunter ein Teilen-Zähler, der hochläuft. Sprechtext: „Warum macht jemand so etwas? Manche verdienen Geld mit Klicks. Manche wollen Meinung machen. Und manche finden es einfach lustig.“ „Oft ist egal, ob es stimmt. Hauptsache, es wird geteilt.“
4. Bild (Was ist ein Deepfake?): Ein Gesicht-Platzhalter wird in drei Schritten gegen ein anderes getauscht (ohne echte Person, abstrakte Figur). Daneben eine Klangwelle, die sich verwandelt. Sprechtext: „Ein Deepfake ist ein Bild, ein Video oder eine Stimme, die eine KI erzeugt oder verändert hat.“ „Bei Stimmen reichen manchen Programmen schon wenige Sekunden Aufnahme. Dafür kann eine kurze Sprachnachricht genügen.“
5. Bild (Spaß oder Schaden): Waage: links Meme-Karte Gekennzeichneter Witz, grün; rechts Karte Echt aussehende Lüge, rot. Zeiger kippt nach rechts. Sprechtext: „Nicht jeder Deepfake ist böse. Ein gekennzeichneter Witz oder ein Film mit Spezialeffekten ist harmlos.“ „Schwierig wird es, wenn etwas echt aussehen soll und jemanden sagen lässt, was er nie gesagt hat.“
6. Bild (So prüfst du): Drei Karten mit Nummern: Passt das zur Person? Berichten seriöse Quellen? Rückruf über bekannte Nummer, Telefon-Symbol mit Pfeil zurück. Sprechtext: „So prüfst du. Erstens: Passt das zu dieser Person? Zweitens: Berichten seriöse Quellen darüber?“ „Drittens, bei Anrufen und Sprachnachrichten: Ruf zurück, über die Nummer, die du schon kennst.“
7. Bild (Das Codewort): Ein Schloss mit Sprechblase Pizza-Salami, zwei Figuren (Familie, Freunde) verbunden. Ein Hundenamen-Zettel wird durchgestrichen. Sprechtext: „Mach mit Familie und Freunden ein Codewort aus. Es darf ruhig albern sein.“ „Wer in einer Notlage das Codewort nicht kennt, ist vermutlich nicht der, der er vorgibt zu sein. Ein Hundename ist dafür zu leicht zu erraten.“
8. Bild (Teilen ist Mitmachen): Ein Teilen-Pfeil mit Kettenreaktion: aus einem Punkt werden viele. Daneben eine Karte mit durchgestrichener Bloßstellen-Figur: Fake von echten Menschen. Sprechtext: „Und du? Teilen ist Mitmachen. Lies erst, bevor du weiterschickst.“ „Fakes von echten Menschen, die sie bloßstellen, sind kein Spaß. Sie können sehr weh tun, und sie können strafbar sein.“ „Bau sie nicht und schick sie nicht weiter.“
9. Bild (Wenn es dich trifft): Vier Schritte als Leiste: Bildschirmfoto machen, Inhalt melden, Vertrauensperson, Nummer gegen Kummer mit Telefon-Symbol und Ziffern 116 111. Sprechtext: „Wenn es dich trifft: Mach Bildschirmfotos, melde den Inhalt der Plattform und sprich mit jemandem, dem du vertraust.“ „Die Nummer gegen Kummer hilft Jugendlichen kostenlos und anonym. Sie lautet: eins eins sechs, eins eins eins.“

Belege und Hinweise:
- Falschinformation und Desinformation wie auf der Lektionsseite (Medienforschung, unter anderem Wardle und Derakhshan 2017).
- Nummer gegen Kummer 116 111: bundesweites, kostenloses und anonymes Beratungstelefon für Kinder und Jugendliche.
- Recht am eigenen Bild (Kunsturhebergesetz) und mögliche Strafbarkeit bloßstellender Fälschungen: wie auf der Lektionsseite, im Video nur als Möglichkeit formuliert (kann strafbar sein).
- Stimmen klonen mit kurzer Aufnahme: ist Stand der Technik bei mehreren Programmen, im Video ohne Zahlen formuliert (wenige Sekunden). Die Rückruf-Regel und das Codewort sind gängige Empfehlungen von Verbraucher- und Polizeistellen.

## `ki-hausaufgaben-fair` (Seite `ki-hausaufgaben-fair`)

Titel: KI und Hausaufgaben  
Untertitel: Lernen, ohne zu schummeln  
Kernaussage: KI ist ein guter Nachhilfepartner und ein schlechter Ersatz fürs Denken. Fair heißt: Regeln erfragen, offen sagen, nachprüfen, selbst erklären können.  
Dauer: 132 Sekunden.

1. Bild (Der Auftrag): Ein Chatfenster: Schreib mir eine Erörterung zum Handyverbot, fünf Seiten. Darunter erscheint eine Textwand in Sekunden, eine Uhr zeigt kurze Zeit. Sprechtext: „Eine Erörterung zum Handyverbot, fünf Seiten, morgen früh. Die KI schreibt sie in Sekunden.“ „Verlockend. Aber schauen wir ehrlich, was dir das bringt.“
2. Bild (Das Fitnessstudio): Zwei Figuren: eine hebt Hantel, wird sichtbar stärker, eine zweite schaut zu, Muskel-Anzeige bleibt klein. Beschriftung Dein Kumpel hebt. Sprechtext: „Stell dir ein Fitnessstudio vor, in dem dein Kumpel die Gewichte für dich hebt. Er wird stärker. Du nicht.“ „Mit Hausaufgaben ist es genauso. Gelernt wird nur, was du selbst denkst.“
3. Bild (Dafür ist KI gut): Vier Kacheln mit Symbolen: Erklären (Glühbirne), Abfragen (Fragezeichen), Feedback zum Text (Stift), Ideen sammeln (Funken). Grüne Haken. Sprechtext: „Dafür kann eine KI richtig gut sein. Sie erklärt dir den Stoff noch einmal anders. Sie fragt dich ab.“ „Sie zeigt dir, wo dein Text holpert. Und sie hilft dir, Ideen zu sammeln.“
4. Bild (Wo es unfair wird): Ein Text mit KI-Funken, der in ein Heft mit dem Namen des Schülers wandert, durchgestrichen. Zwei rote Folgen: nichts gelernt, Täuschung. Sprechtext: „Unfair wird es, wenn du ihren Text als deinen abgibst. Das ist wie Abschreiben, nur schneller.“ „Und es schadet dir doppelt. Du lernst nichts, und die Lehrkraft kann es als Täuschung werten.“
5. Bild (Die Ampel): Ampel mit drei Lichtern. Grün: erklären, abfragen. Gelb: Text überarbeiten lassen, offen sagen. Rot: fertigen Text abgeben. Darüber ein Schulgebäude-Symbol, Regeln. Sprechtext: „Die Regeln sind je nach Schule, Fach und Lehrkraft verschieden. Frag vorher, wofür du KI nutzen darfst.“ „Ist nichts geregelt, hilft die Ampel. Grün: erklären und abfragen lassen. Gelb: Text überarbeiten lassen, aber offen sagen. Rot: einen fertigen Text abgeben.“
6. Bild (Ein fairer Ablauf): Vier Schritte als Kette, abwechselnd Ich und KI: Ich schreibe die Gliederung, KI sagt was fehlt, Ich schreibe den Text, KI prüft Rechtschreibung. Pfeile dazwischen. Sprechtext: „So kann ein fairer Ablauf aussehen. Erst schreibst du selbst eine Gliederung. Dann fragst du die KI, was fehlt.“ „Dann schreibst du den Text selbst. Zum Schluss lässt du die KI prüfen, wo er noch holpert. Das Denken bleibt bei dir.“
7. Bild (Offen sagen): Ein Heft mit Fußnote: Ich habe KI genutzt für Ideen und Rechtschreibung. Ein Daumen-hoch daneben. Sprechtext: „Sag offen, wie du die KI genutzt hast. Ein Satz reicht: Ich habe mir Ideen sammeln und die Rechtschreibung prüfen lassen.“ „Das wirkt nicht schwach. Es zeigt, dass du weißt, was du tust.“
8. Bild (Nachprüfen): Eine Rechenaufgabe mit KI-Ergebnis und Taschenrechner-Nachrechnung, die abweicht. Ein erfundener Quellen-Link mit Kreuz. Sprechtext: „Und prüf, was die KI sagt. Sie rechnet manchmal falsch und erfindet Quellen.“ „Verantwortlich für das, was du abgibst, bist du, nicht sie.“
9. Bild (Der Tafel-Test): Eine Tafel mit Zeichnung, davor eine Figur ohne Handy. Zwei Wege: Ja, ich kann es erklären (Haken), Nein, nochmal fragen (Pfeil zurück zur KI). Sprechtext: „Ein einfacher Test zum Schluss: Könntest du es morgen an der Tafel erklären, ohne Handy?“ „Wenn ja, hast du etwas gelernt, egal wer geholfen hat. Wenn nein, frag die KI noch einmal, aber diesmal nach der Erklärung.“

Belege und Hinweise:
- Regeln je Schule und Lehrkraft: wie auf der Lektionsseite (die Kultusministerkonferenz überlässt die Umsetzung den Ländern und Schulen).
- Die Rechenaufgabe im Bild (17 mal 6 gleich 102, KI-Wert 112) und die Gleichung 3x plus 5 gleich 20 sind frei gewählt und stimmen rechnerisch.

## `datenschutz-im-alltag` (Seite `datenschutz-im-alltag`)

Titel: Datenschutz im Alltag  
Untertitel: Was du preisgibst und wie du es kontrollierst  
Kernaussage: Du entscheidest mit. Einstellungen prüfen, Fotos und KI-Chats mit Bedacht, gute Passwörter, eigene Rechte kennen, Rechte anderer achten.  
Dauer: 138 Sekunden.

1. Bild (Was weiß das Netz?): Eine Profilkarte in der Mitte (abstrakte Figur). Symbole fliegen hinein: Name, Ort, Fotos, Stimme, Musik, Uhrzeit. Sprechtext: „Was weiß das Netz über dich? Name, Wohnort, Fotos, deine Stimme, was du gern hörst, wann du wo bist.“ „Vieles davon hast du selbst geliefert, ganz nebenbei.“
2. Bild (Bezahlen mit Daten): Eine App mit Preis 0 Euro, daneben eine Waage: Daten gegen Gratis. Ein Werbe-Banner, das zu den Interessen passt. Sprechtext: „Viele Apps kosten kein Geld. Dafür bezahlst du oft mit Daten.“ „Damit lässt sich zeigen, was dich interessiert, und passende Werbung ausspielen. Das ist nicht automatisch schlimm. Du solltest es nur wissen und selbst entscheiden.“
3. Bild (Das Foto verrät mehr): Ein Foto mit aufklappender Infokarte: Ort, Uhrzeit, Handymodell. Daneben ein Schalter Ortsangabe, der ausgeschaltet wird. Sprechtext: „Ein Foto kann mehr verraten, als du siehst. Oft stecken Aufnahmeort, Uhrzeit und Handymodell darin.“ „Manche Netzwerke entfernen das, andere nicht. Schalte die Ortsangabe für die Kamera lieber aus.“
4. Bild (Das Netz vergisst wenig): Ein Zeitstrahl: Foto heute, in Jahren. Ein Foto wird kopiert und verteilt, ein Papierkorb-Symbol erreicht nicht alle Kopien. Frage: Wäre mir das in fünf Jahren noch recht? Sprechtext: „Was einmal online ist, lässt sich schwer ganz löschen. Andere können es speichern und weiterschicken.“ „Frag dich vorher: Wäre mir das in fünf Jahren noch recht?“
5. Bild (Fünf Minuten Einstellungen): Vier Schalter: Profil privat (an), Standort nur bei Nutzung (an), Kamera, Mikrofon, Kontakte für Taschenlampen-App (aus mit Kreuz). Sprechtext: „Nimm dir fünf Minuten für die Einstellungen. Profil auf privat. Standort nur, wenn die App läuft.“ „Kamera, Mikrofon und Kontakte nur für Apps, die sie wirklich brauchen. Eine Taschenlampen-App braucht keine Kontakte.“
6. Bild (KI-Chats): Zwei Spalten: grün Mathe-Aufgabe, Rezeptidee; rot Passwort, Adresse, Geheimnisse, Fotos von anderen. Ein Chatfenster mit Wolke. Sprechtext: „Wichtig bei KI-Chats: Je nach Anbieter und Einstellung kann gespeichert werden, was du eintippst.“ „Mathe-Aufgaben und Rezeptideen sind unproblematisch. Passwörter, Adresse, Geheimnisse und Fotos von anderen gehören nicht hinein.“
7. Bild (Gute Passwörter): Ein schwaches Passwort Hund123 durchgestrichen, daneben vier Wörter hintereinander als Bausteine, grün. Ein Schild Zwei Schritte mit Handy-Symbol. Sprechtext: „Ein gutes Passwort ist lang und gehört nur zu einem Konto. Vier zufällige Wörter hintereinander sind stark und leichter zu merken als Zeichenchaos.“ „Schalte außerdem die Anmeldung in zwei Schritten ein. Dann reicht einem Dieb das Passwort allein nicht.“
8. Bild (Deine Rechte): Zwei Sprechblasen an ein Firmengebäude: Was habt ihr über mich gespeichert? Bitte löschen. Ein Paragraph-Zeichen oder EU-Siegel. Sprechtext: „Du hast Rechte. Du darfst fragen: Was habt ihr über mich gespeichert? Und du darfst verlangen, dass sie es löschen.“ „Das steht in der Datenschutz-Grundverordnung. Für viele Dienste brauchen unter Sechzehnjährige außerdem die Zustimmung ihrer Eltern.“
9. Bild (Und die anderen): Ein Gruppenfoto-Rahmen mit vier abstrakten Figuren, eine Figur hebt die Hand: Frag mich! Ein Teilen-Pfeil mit Frage. Sprechtext: „Und denk an die anderen. Ein Foto von Freunden gehört auch ihnen. Frag, bevor du es teilst.“ „Das ist Respekt, und es ist auch Recht: Jeder darf über Bilder von sich selbst mitentscheiden.“

Belege und Hinweise:
- Fotos speichern je nach Einstellung Aufnahmeort, Uhrzeit und Gerät (EXIF-Metadaten).
- Auskunft und Löschung: Artikel 15 und 17 der Datenschutz-Grundverordnung. Einwilligung Minderjähriger: Artikel 8, Schwelle 16 Jahre, im Video vorsichtig mit oft und für viele Dienste formuliert (siehe docs/jugendpaedagogik.md, Rechtsfrage beim Betreiber).
- Anbieter von KI-Chats speichern Eingaben je nach Dienst und Einstellung, wie auf der Lektionsseite. Vier zufällige Wörter als Passwort: gängige Empfehlung (Diceware-Verfahren).

## `prompts-fuer-schueler` (Seite `prompts-fuer-schueler`)

Titel: Gute Prompts für die Schule  
Untertitel: Fragen, mit denen du wirklich etwas lernst  
Kernaussage: Je mehr die KI über dich und deine Aufgabe weiß, desto besser hilft sie. Lass dir Hinweise geben, lass dich abfragen, hake nach, und prüfe die Antwort.  
Dauer: 134 Sekunden.

1. Bild (Die Textwand): Ein Chat: Erklär Bruchrechnung. Antwort ist eine graue Textwand mit Skelett-Zeilen, ein Gähn-Symbol daneben. Sprechtext: „Du tippst: Erklär Bruchrechnung. Und bekommst eine Textwand, die auch aus einem Lexikon sein könnte.“ „Oft liegt das nicht an der KI, sondern an der Frage.“
2. Bild (Sie muss raten): Eine KI-Figur mit Fragezeichen: Klasse? Vorwissen? Was nervt? Drei Fragen schweben um sie. Sprechtext: „Eine KI sieht nicht, in welcher Klasse du bist. Sie weiß nicht, was du schon kannst und was dich nervt.“ „Wenn du es ihr nicht sagst, rät sie. Und Raten ergibt Durchschnitt.“
3. Bild (Rolle und Kontext): Zwei Bausteine: Rolle und Kontext, mit Beispieltexten in Sprechblasen: Du bist ein geduldiger Nachhilfelehrer. Ich bin in Klasse acht und verstehe das Kürzen nicht. Sprechtext: „Sag ihr, wer sie sein soll und wer du bist. Zum Beispiel: Du bist ein geduldiger Nachhilfelehrer.“ „Ich bin in Klasse acht und verstehe das Kürzen nicht.“
4. Bild (Aufgabe und Format): Bausteine Aufgabe und Format und Grenzen: in drei Schritten, Beispiel aus dem Alltag, kurze Sätze, keine Fachwörter ohne Erklärung. Sprechtext: „Dann sag, was sie tun soll und wie. Erkläre es in drei Schritten, mit einem Beispiel aus dem Alltag, in kurzen Sätzen.“ „Du kannst auch sagen, was sie lassen soll. Zum Beispiel keine Fachwörter ohne Erklärung.“
5. Bild (Hinweise statt Lösung): Eine Aufgabe, daneben eine Glühbirne mit Tipp, die Lösung bleibt verdeckt (Schloss). Chat: Gib mir nur einen Tipp. Sprechtext: „Der beste Trick fürs Lernen: Bitte um Hinweise statt um die Lösung. Sag: Gib mir nur einen Tipp, ich probiere es selbst.“ „So bleibt das Denken bei dir.“
6. Bild (Lass dich abfragen): Chat: Stell mir fünf Fragen, eine nach der anderen. Karten mit Frage 1 bis 5, die erste ist beantwortet, Haken. Sprechtext: „Lass dich abfragen. Stell mir fünf Fragen, eine nach der anderen, und sag mir am Ende, was ich üben soll.“ „Das ist wie Vokabeln lernen mit einem Partner, der nie genervt ist.“
7. Bild (Erklär es zurück): Zwei Sprechblasen mit getauschten Rollen: Schüler erklärt (große Blase), KI antwortet: Das stimmt, aber hier fehlt etwas. Pfeil im Kreis. Sprechtext: „Dreh den Spieß um. Erkläre der KI das Thema in eigenen Worten und frag: Was stimmt, was fehlt, was ist falsch?“ „Wer etwas erklären kann, hat es verstanden. Und du merkst sofort, wo es noch hakt.“
8. Bild (Nachhaken): Kreislauf: Prompt, Antwort, Korrektur (zu schwer, zu lang), besserer Prompt. Zusätzlich Sprechblase: Frag mich, wenn dir etwas fehlt. Sprechtext: „Der erste Versuch ist selten perfekt. Sag, was nicht passt: zu schwer, zu lang, noch ein Beispiel bitte.“ „Du kannst ihr auch erlauben, nachzufragen. Sag: Frag mich, wenn dir etwas fehlt.“
9. Bild (Prüfen und schützen): Links Lupe auf Antwort mit Zahlen und Quellen. Rechts Schloss, durchgestrichene Namen und Adresse. Sprechtext: „Prüf die Antwort, vor allem bei Zahlen und Quellen. Sie kann überzeugend klingen und trotzdem falsch sein.“ „Und lass Namen, Adressen und Privates draußen.“
10. Bild (Deine Vorlage): Eine Schablone zum Ausfüllen mit vier Lücken: Klasse, Thema, Schritte, Abfragen. Haken am Ende. Sprechtext: „Deine Vorlage: Ich bin in Klasse so und so. Ich will dieses Thema verstehen. Erkläre es in kleinen Schritten, dann frag mich ab.“ „Probier sie aus und verbessere sie, bis sie zu dir passt.“

Belege und Hinweise:
- Bausteine wie in der Folge prompting-grundlagen und auf der Lektionsseite (Rolle, Aufgabe, Material, Format, Grenzen). Im Bild heißt der Kasten für das, was die KI über dich wissen muss, Material und Kontext.

## Prüfung der fertigen Filme

Jeder Film: Dauer, Lautheit (loudnorm, Ziel -16 LUFS), 8 Standbilder aus der fertigen mp4 (`videos/nachprobe.sh`), Untertitelspur, Aussprache (lokal mit whisper.cpp, Modell small, Satz für Satz gegen den Text verglichen, Wortfehlerrate 1 bis 5 Prozent, Abweichungen fast nur Ziffernschreibung und Worttrennung).

| Id | Dauer | Lautheit | Spitze | Wortfehlerrate |
|---|---|---|---|---|
| `echt-oder-ki` | 151,1 s | -16,1 LUFS | -1,8 dBTP | 1,2 % |
| `quellen-pruefen` | 149,3 s | -16,1 LUFS | -1,7 dBTP | 4,0 % |
| `fake-news-deepfakes` | 145,7 s | -16,1 LUFS | -1,9 dBTP | 5,3 % |
| `ki-hausaufgaben-fair` | 131,8 s | -16,1 LUFS | -1,7 dBTP | 2,4 % |
| `datenschutz-im-alltag` | 138,1 s | -16,1 LUFS | -1,9 dBTP | 4,5 % |
| `prompts-fuer-schueler` | 133,6 s | -16,1 LUFS | -1,9 dBTP | 1,3 % |

Offene Hörpunkte (nur von Menschen sicher zu beurteilen): "Content Credentials" klingt englisch eingedeutscht, "Deepfake" und "Fakes" wurden vom Erkenner als "diebfake" und "fikes" gehört (Aussprachehilfe `Diepfäik`, `Fäiks` in `videos/aussprache.json`). Einmal anhören; bei Bedarf Schreibweise anpassen, nur die betroffenen Sätze kosten dann neu.
Dateigrößen liegen unter 8 MB (CRF 33 bei den längeren Folgen, Bild ist ruhig und flächig).
Der Seiteninhalt wurde gegen `content-medien.js` gelesen: Begriffe angeglichen (Falschinformation statt Fehlinformation, Kasten Material und Kontext). Die Seiten haben noch kein `videos`-Feld.
