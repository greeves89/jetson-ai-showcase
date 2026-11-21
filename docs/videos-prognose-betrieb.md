# Videoskizzen: Strang Daten und Prognosen, KI im Betrieb

Je Video 70 bis 100 Sekunden, Sprechtext in Du-Form mit kurzen Sätzen, Bildideen aus der echten Oberfläche oder einfachen Grafiken. Keine Kundennamen, keine erfundenen Zahlen außer klar als Beispiel genannten. Die Videos entstehen später.

## entscheidungsbaeume (Seite `tabellen-ml`)
**Titel:** Entscheidungsbäume in 90 Sekunden. **Kernaussage:** Ein Baum ist ein Fragebogen, dessen beste Fragen aus Beispielen gelernt werden, und bei Tabellen genügt er oft.
1. **Bild:** Zwei Hände, ein Zettel „Ist es ein Tier?“. **Sprechtext:** Du kennst das Ratespiel mit Ja-Nein-Fragen. Mit wenigen klugen Fragen findest du die Lösung. Jede Antwort schließt einen Teil der Möglichkeiten aus.
2. **Bild:** Ein Baumdiagramm „Zahlungsrückstände?“, zwei Äste, Blätter „annehmen“ und „ablehnen“. **Sprechtext:** Ein Entscheidungsbaum ist genau das: eine Kette von Fragen, am Ende steht eine Antwort. Jeder Weg vom Anfang bis zum Blatt lässt sich nachlesen.
3. **Bild:** Zehn Karten, sechs grün, vier rot, die Frage teilt sie in zwei Stapel. **Sprechtext:** Beim Lernen wählt der Baum die Frage, die die Fälle am saubersten trennt. Das wiederholt er für jeden Stapel. Eine Frage, die nichts trennt, fliegt raus.
4. **Bild:** Der Baum wird immer größer, bis jedes Blatt eine Karte hat, daneben ein Warnschild. **Sprechtext:** Lässt du ihn ungebremst wachsen, lernt er Zufälle auswendig. Auf den Trainingsdaten stimmt dann alles, bei neuen Daten nicht mehr. Das heißt Überanpassung. Begrenze die Tiefe und prüfe mit neuen Daten.
5. **Bild:** Viele kleine Bäume stimmen ab, ein Balken zeigt die Mehrheit. **Sprechtext:** Viele Bäume, jeder mit anderen Daten, bilden einen Wald. Die Mehrheit gleicht einzelne Fehler aus. Das macht ihn stabiler, aber schwerer zu lesen.
6. **Bild:** Tabelle links, Bild und Text rechts, Pfeile zu den passenden Verfahren. **Sprechtext:** Bei Tabellen genügen Bäume oft. Bei Bildern, Ton und Text brauchst du meist ein neuronales Netz. Fang einfach an, dann bleibt es billig und erklärbar.
7. **Bild:** Eine Tabelle, ein kleiner Baum, ein Häkchen. **Sprechtext:** Das Wichtigste: Ein Baum ist ein Fragebogen, den die Daten schreiben. Probiere es im Labor selbst aus.

## zeitreihen-prognose (Seite `zeitreihen`)
**Titel:** Wie Prognosen entstehen. **Kernaussage:** Ein Modell schreibt Trend und Saison fort, den Zufall nicht, und eine gute Prognose nennt ihre Unsicherheit.
1. **Bild:** Wetter-App mit Vorhersage für morgen. **Sprechtext:** „Morgen wird es wie heute.“ Diese Faustregel schlägt man nur mit Mühe. Das ist der Maßstab für jedes Modell.
2. **Bild:** Eine Kurve wird in drei Linien zerlegt: Trend, Saison, Rauschen. **Sprechtext:** Jede Zeitreihe besteht aus Trend, Saison und Zufall. Das Eiscafé wächst über die Jahre, verkauft im Sommer mehr, und ein Regentag stört. Wer die Teile trennt, versteht den Verlauf besser.
3. **Bild:** Die Kurve läuft über den Rand hinaus weiter, Trend und Saison gestrichelt. **Sprechtext:** Das Modell führt Trend und Saison fort. Den Zufall kann es nicht vorhersagen. So entsteht die Prognose für die nächsten Wochen.
4. **Bild:** Ein Band um die Prognose, das nach rechts breiter wird. **Sprechtext:** Gute Prognosen nennen einen Bereich statt einer einzelnen Zahl. Je weiter in die Zukunft, desto breiter wird er. Mit diesem Bereich kannst du Puffer planen.
5. **Bild:** Maschine mit Vibrationskurve, die langsam ansteigt, Wartungssymbol. **Sprechtext:** Auch Maschinen zeigen Vorboten. Wer sie erkennt, wartet, wenn es nötig ist, nicht zu früh und nicht zu spät. Zu früh tauschen verschwendet Teile, zu spät kostet Stillstand.
6. **Bild:** Ein Ereignis-Blitz bricht die Kurve, daneben das Wort „nie gesehen“. **Sprechtext:** Was es noch nie gab, kennt das Modell nicht. Deshalb bleibt ein Mensch dabei. Den Fehler siehst du spätestens, wenn der echte Wert eintrifft.
7. **Bild:** Ein Kalender mit einer Kurve darüber. **Sprechtext:** Prüfe jede Prognose gegen eine einfache Faustregel und halte die Daten frisch.

## anomalieerkennung (Seite `anomalien`)
**Titel:** Auffälliges finden. **Kernaussage:** Ein Modell lernt, wie normal aussieht, und meldet Abweichungen. Der Schwellenwert bestimmt das Verhältnis aus Fehlalarmen und übersehenen Fällen, und ein Mensch prüft.
1. **Bild:** Kontoauszug mit einer markierten Zeile. **Sprechtext:** Eine Abbuchung, die nicht zu dir passt. Du erkennst sie, ohne je ein Handbuch für Betrug gelesen zu haben. Das ist ihr Vorteil: Sie braucht keine Liste von Fehlern.
2. **Bild:** Eine ruhige Messkurve mit einer Spitze. **Sprechtext:** Das Modell lernt aus dem Normalbetrieb. Was davon abweicht, ist auffällig. Dafür braucht es gute Daten aus gesunden Zeiten.
3. **Bild:** Wenige rote Punkte unter vielen grauen, daneben der Text „6 Fehler, 10 000 normal“. **Sprechtext:** Fehler sind selten, und der nächste sieht anders aus. Darum lernt man das Normale und nicht die Fehler. So fällt auch ein Fehler auf, der noch nie auftrat.
4. **Bild:** Ein Schieberegler, links viele Markierungen, rechts wenige. **Sprechtext:** Der Schwellenwert entscheidet. Ist er niedrig, gibt es viele Fehlalarme. Ist er hoch, bleibt manches unentdeckt. Es gibt keinen Wert, der beides perfekt macht.
5. **Bild:** Eine Liste von Meldungen, daneben ein Mensch mit Lupe. **Sprechtext:** Bei seltenen Ereignissen sind die meisten Meldungen falsch, selbst bei einem guten Verfahren. Darum prüft ein Mensch. Ein Beispiel: Zehn echte Fälle unter zehntausend Buchungen, und trotzdem sind etwa neun von zehn Meldungen falsch.
6. **Bild:** Fabrikhalle, Bankkarte, Serverraum nebeneinander. **Sprechtext:** Ob in der Fertigung, bei Zahlungen oder im IT-Betrieb: Das Verfahren liefert Hinweise, keine Urteile. Der Mensch entscheidet, was wirklich los ist.
7. **Bild:** Ein Mensch, ein Bildschirm, ein Häkchen. **Sprechtext:** Aus seinen Entscheidungen lernt das System weiter. Auffälliges finden heißt: hinschauen, nicht verurteilen.

## empfehlungssysteme (Seite `empfehlungen`)
**Titel:** Wie Empfehlungen entstehen. **Kernaussage:** Empfehlungen entstehen aus Ähnlichkeit, haben typische Fallen und müssen an ihrem Nutzen gemessen werden.
1. **Bild:** Eine Buchhändlerin reicht ein Buch über den Tresen. **Sprechtext:** Du kennst das: „Das hier gefällt dir bestimmt.“ Sie kennt dich und Kunden, die dir ähneln. Ein System macht das für tausende Kunden gleichzeitig.
2. **Bild:** Tabelle mit drei Personen und vier Produkten, zwei Zeilen leuchten ähnlich. **Sprechtext:** Das System vergleicht Zeilen. Wer dir ähnlich ist, hat vielleicht etwas, das du noch nicht hast. Aus dieser Ähnlichkeit folgt die Empfehlung.
3. **Bild:** Zwei Produkte rücken im Raum zusammen. **Sprechtext:** Auch Dinge ähneln sich. Wer die eine Dichtung kauft, braucht wahrscheinlich die zweite. So schlägt das System Teile vor, bevor jemand sucht.
4. **Bild:** Ein leeres Profil mit Fragezeichen. **Sprechtext:** Bei neuen Nutzern fehlt das Verhalten. Das ist der Kaltstart. Hilfe: fragen, oder zuerst Beliebtes zeigen. Auch ein neues Produkt hat dieses Problem.
5. **Bild:** Ein Kreis, der sich verengt. **Sprechtext:** Aufgepasst: Wer nur empfiehlt, was schon gefällt, sperrt sich ein. Mische bewusst Neues bei. So lernt das System auch, was dir sonst noch gefallen könnte.
6. **Bild:** Zwei Zahlen: „angeklickt“ und „behalten“. **Sprechtext:** Miss, ob das Empfohlene genutzt wird, nicht nur, ob es angeklickt wurde. Halte Verhaltensdaten sparsam, denn sie sind personenbezogen.
7. **Bild:** Ein Zahnrad und ein Schutzschild. **Sprechtext:** Empfehlungen sparen Suchzeit, wenn du sie an ihrem Nutzen misst und mit Daten sorgsam umgehst.

## mlops-betrieb (Seite `mlops`)
**Titel:** Vom Prototyp in den Betrieb. **Kernaussage:** Ein Modell im Betrieb braucht einen Kreislauf aus Daten, Prüfung, Auslieferung, Überwachung und Nachlernen, dazu einen Rückweg und eine Verantwortliche.
1. **Bild:** Heimküche, dann Restaurantküche. **Sprechtext:** Zu Hause darf ein Gericht schiefgehen. In der Restaurantküche muss es jeden Abend sitzen, hundertmal.
2. **Bild:** Ein Kreis mit sechs Stationen, Daten, Training, Prüfen, Ausliefern, Überwachen, Nachlernen. **Sprechtext:** Mit KI ist es genauso. Der Betrieb ist ein Kreislauf, kein einmaliger Weg. Jede Station hat jemanden, der dafür gerade steht.
3. **Bild:** Ein alter Stadtplan, daneben eine neue Straße. **Sprechtext:** Die Welt ändert sich, das Modell nicht. Das heißt Drift. Die Qualität sinkt, oft leise. Der alte Plan war nie falsch, die Stadt ist nur weitergebaut worden.
4. **Bild:** Ein Armaturenbrett mit Qualität, Antwortzeit, Auslastung. **Sprechtext:** Darum brauchst du ein Armaturenbrett. Du siehst, ob es richtig liegt, schnell genug ist und die Hardware reicht. Fällt ein Wert aus dem Rahmen, bekommt jemand Bescheid.
5. **Bild:** Zwei Versionsnummern, ein Pfeil zurück. **Sprechtext:** Jede Version ist beschriftet. Wird die neue schlechter, gehst du zurück. Übe das vorher. So bleibt ein Fehler ein kleiner Zwischenfall.
6. **Bild:** Der Jetson-Bildschirm mit Speicher, Leistung und Temperatur. **Sprechtext:** Auf einem kleinen Gerät sind Speicher und Wärme knapp. Dafür bleiben die Daten vor Ort, und es gibt keinen Netzweg.
7. **Bild:** Ein Steckbrief mit Datum und Verantwortlichem. **Sprechtext:** Halte fest, wofür das Modell da ist, was es nicht kann und wer sich kümmert. Dann ist es im Betrieb angekommen.

## kosten-und-energie (Seite `kosten-energie`)
**Titel:** Was KI wirklich kostet. **Kernaussage:** Lokal, Cloud und Edge haben unterschiedliche Stärken, Kosten bestehen aus mehr als Hardware, und den Strom rechnest du mit offenen Annahmen selbst aus.
1. **Bild:** Auto, Leasingvertrag, Taxi. **Sprechtext:** Kaufen, leasen oder Taxi fahren. Bei KI hast du dieselbe Wahl: lokal, Cloud oder am Gerät. Wer nur den Preis vergleicht, übersieht den Rest.
2. **Bild:** Eine Tabelle mit drei Spalten und sechs Zeilen, einzelne Zellen leuchten auf. **Sprechtext:** Sie unterscheiden sich bei Anschaffung, laufenden Kosten, Leistung, Datenschutz, Reaktionszeit und Wartung. Eine einzige beste Wahl gibt es nicht.
3. **Bild:** Ein Eisberg, oben „Hardware“, unten „Personal, Datenpflege, Speicher“. **Sprechtext:** Die Hardware ist nur die Spitze. Personal und Datenpflege machen oft den größeren Teil aus. Rechne also über die ganze Laufzeit.
4. **Bild:** Die Hardware-Seite des Labors mit der Leistung des Jetson. **Sprechtext:** Das kleine Gerät hier nimmt nur wenige Watt auf. Auf der Hardware-Seite siehst du den aktuellen Wert. Dort siehst du auch, wie stark er gerade ausgelastet ist.
5. **Bild:** Die Rechnung Watt mal Stunden durch tausend mal Preis, mit Annahmen. **Sprechtext:** Watt mal Stunden, geteilt durch tausend, ergibt Kilowattstunden. Mal dein Preis ergibt Euro. Nenne deine Annahmen offen. Ein Beispiel mit angenommenen Zahlen: 15 Watt, 24 Stunden, 30 Cent ergibt etwa elf Cent am Tag.
6. **Bild:** Eine Waage mit „Datenschutz“, „Reaktionszeit“, „Preis“. **Sprechtext:** Frag zuerst nach Datenschutz und Reaktionszeit. Erst danach kommt der Preis.
7. **Bild:** Ein Taschenrechner und ein Notizzettel. **Sprechtext:** Rechne mit deinen Zahlen und schreibe die Annahmen dazu. Dann kann jeder deine Rechnung nachprüfen.

## ki-einfuehren (Seite `ki-einfuehrung`)
**Titel:** KI im Unternehmen einführen. **Kernaussage:** Wähle einen kleinen, nützlichen Fall, teste ihn als Pilot mit klarem Maßstab, nimm Menschen mit und entscheide dann: stoppen, ändern oder ausrollen.
1. **Bild:** Ein Hammer und ein Problem-Zettel. **Sprechtext:** Fang nicht mit der Technik an, sondern mit dem Problem. Du kaufst auch keine Bohrmaschine ohne Loch. Die KI muss ihren Platz erst verdienen.
2. **Bild:** Ein Raster aus Nutzen, Machbarkeit, Daten, Risiko. **Sprechtext:** Bewerte Ideen nach Nutzen, Machbarkeit, Daten und Risiko. Starte mit dem leichten Karton. Ein erstes Projekt darf klein, sichtbar und sicher sein.
3. **Bild:** Ein Auto auf Probefahrt, Stoppuhr. **Sprechtext:** Ein Pilot ist die Probefahrt. Lege vorher fest, woran du Erfolg misst, und wann du abbrichst. Ohne diesen Maßstab entscheidet am Ende die Stimmung.
4. **Bild:** Eine Gruppe um eine neue Maschine. **Sprechtext:** Nimm die Menschen früh mit. Erkläre, was sich ändert und was nicht, und schule im Umgang mit den Grenzen. Wer die Grenzen kennt, verlässt sich richtig.
5. **Bild:** Vier Hände, Fachbereich, IT, Datenschutz, Betriebsrat. **Sprechtext:** Hol Fachbereich, IT, Datenschutz und Betriebsrat von Anfang an an den Tisch. Je früher sie dabei sind, desto weniger Umbau später.
6. **Bild:** Eine Ampel mit Stoppen, Ändern, Ausrollen. **Sprechtext:** Am Ende steht die Entscheidung: stoppen, ändern oder ausrollen. Auch ein Stopp ist ein Ergebnis. Entscheide nach Kriterien, die vorher feststanden.
7. **Bild:** Eine Checkliste mit Haken. **Sprechtext:** Beginne klein, miss gegen den heutigen Ablauf und nimm die Menschen mit. So wird aus einer Idee ein Betrieb.
