# Entwurf: Abschnitt "KI-Labor" für die Datenschutzerklärung

Stand 22.11.2026. Aus dem tatsächlichen Verhalten des Labors abgeleitet (Quellen: app/app.py, app/static/*.js, Betriebsaufbau). Das ist ein Entwurf und kein Rechtsrat. Mit "BESTÄTIGEN" markierte Aussagen muss der Verantwortliche vor Veröffentlichung prüfen.

## KI-Labor (ki-labor.daniel-alisch.site)

Das KI-Labor ist ein kostenloses Lernangebot. Es braucht kein Konto und keine Anmeldung.

**Was beim Aufruf passiert.** Die Anfrage läuft über einen Server von Daniel Alisch (Webserver-Protokoll mit IP-Adresse, Uhrzeit und aufgerufener Adresse) und über einen Cloudflare-Tunnel zu einem Rechner im Heimnetz des Verantwortlichen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (sicherer Betrieb). Speicherdauer der Serverprotokolle: BESTÄTIGEN (Standardwert des Servers prüfen). Cloudflare, Inc. (USA) verarbeitet den Datenverkehr als Auftragsverarbeiter: BESTÄTIGEN (Auftragsverarbeitungsvertrag und Drittlandübermittlung prüfen).

**Cookie und Browser-Speicher.** Das Labor setzt ein technisch notwendiges Sitzungs-Cookie `kl_s` (zufällige Kennung, 24 Stunden gültig, nur über HTTPS). Es ordnet deine Beispiele und eingefügten Texte deiner Sitzung zu. Die Daten dieser Sitzung verfallen nach 30 Minuten ohne Aktivität. Im Browser speichert das Labor außerdem Einstellungen und Fortschritt (`kl-besucht`, `kl-nav-offen`, `kl-lesemodus` und die gemerkte Einwilligung zur Kamera). Diese Einträge verlassen deinen Browser nicht. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG und Art. 6 Abs. 1 lit. f DSGVO.

**Kamera und Mikrofon.** Beides startet nur nach deiner ausdrücklichen Zustimmung im Labor und der Freigabe deines Browsers (Art. 6 Abs. 1 lit. a DSGVO). Im Gesichtserkennungs-Labor werden aus Gesichtern Zahlenlisten berechnet, mit denen sich Gesichter wiedererkennen lassen. Das sind biometrische Daten (Art. 9 DSGVO). Dafür holt das Labor eine ausdrückliche Einwilligung (Art. 9 Abs. 2 lit. a DSGVO) per aktiver Bestätigung ein. Nutze nur dein eigenes Gesicht oder Gesichter von Personen, die zugestimmt haben. Die Kamera- und Mikrofon-Labore sind ab 16 Jahren gedacht, jüngere Nutzer brauchen das Einverständnis ihrer Eltern. Bilder und Ton werden zur Berechnung an den Rechner des Labors gesendet und dort im Arbeitsspeicher verarbeitet. Es gibt keine Speicherung von Kamerabildern oder Aufnahmen. Gesichtserkennung im Anlern-Labor erzeugt aus Bildern Zahlenlisten, die nur in deiner Sitzung liegen und mit ihr verfallen. Du kannst jederzeit stoppen. Du kannst die Zustimmung jederzeit mit Wirkung für die Zukunft widerrufen (Knopf im Labor, oder Seite schließen). Dann endet die Verarbeitung sofort und die Sitzungsdaten werden gelöscht.

**Eingegebene Texte.** Texte, die du ins Chat-, Dokumenten- oder Sprachlabor einfügst, werden von lokalen Sprachmodellen auf dem Rechner des Labors verarbeitet, nicht von externen KI-Diensten: BESTÄTIGEN (kein Dienst eines Dritten angebunden). Sie bleiben im Arbeitsspeicher und verschwinden mit dem Ende der Sitzung oder dem Neustart. Gib keine echten personenbezogenen Daten Dritter und keine Geheimnisse ein.

**Empfänger.** Hosting-Dienstleister des Proxy-Servers: IONOS SE, Auftragsverarbeitung (BESTÄTIGEN: Vertrag im IONOS-Konto akzeptiert). DNS-Anbieter: Strato AG. Cloudflare als Tunnelanbieter. Keine Weitergabe zu Werbezwecken, kein Tracking, keine Analyse-Cookies.

**Deine Rechte.** Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit und Beschwerde bei einer Aufsichtsbehörde, wie im allgemeinen Teil dieser Erklärung beschrieben.

## Hinweise zur Recherche (Stand 22.11.2026)
- Session-Cookies, die für den Betrieb unbedingt nötig sind, brauchen nach § 25 Abs. 2 Nr. 2 TDDDG keine Einwilligung. Sie müssen in der Datenschutzerklärung stehen, die Informationspflicht nach Art. 13 DSGVO bleibt (Quellen: IHK Köln, IHK Regensburg, DFN "Website Cookies DSGVO").
- Cloudflare bietet ein Data Processing Addendum (DPA, Version 6.3, Standardvertragsklauseln) und beruft sich auf die DPF-Zertifizierung. Das DPA muss im Cloudflare-Konto akzeptiert werden (Dashboard). Ob Tunnel-Verbindungsdaten ausdrücklich in Annex 1 erfasst sind, ist zu prüfen (Quelle: cloudflare.com/trust-hub/gdpr, cloudflare.com/dpa).
- Verarbeitung ohne Speicherung bleibt Verarbeitung (Art. 4 Nr. 2 DSGVO). Biometrische Daten zur eindeutigen Identifizierung sind besondere Kategorien (Art. 9 DSGVO); ein bloßer Browser-Dialog genügt nicht, eine ausdrückliche Einwilligung ist nötig (Rechtsprechung zu Online-Prüfungen, z. B. Thüringer OLG 2025).
- Hosting-Anbieter des Proxy-Servers: Auftragsverarbeitungsvertrag prüfen (der Server liegt im Adressbereich von IONOS, DNS bei Strato).
