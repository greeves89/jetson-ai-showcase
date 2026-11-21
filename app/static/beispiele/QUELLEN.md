# Quellen und Lizenzen der Beispieldaten

Alle Dateien in diesem Ordner sind selbst erzeugt oder stammen aus freien Quellen. Sie werden von `scripts/beispiele_bauen.py` und `scripts/beispiele_fotos.py` reproduzierbar erzeugt.

## Fotos (Wikimedia Commons)

Nur Bilder mit der Lizenz CC0 oder gemeinfrei (Public domain), geprüft am Feld `LicenseShortName` der Commons-API. Die Bilder wurden auf höchstens 960 Pixel Breite verkleinert und neu als JPEG gespeichert (EXIF-Daten entfernt). Bei CC0 und gemeinfreien Werken ist keine Namensnennung verpflichtend, sie erfolgt hier freiwillig.

- `fotos/logistik-lieferwagen-fahrrad.jpg`
  - Titel: Yamato delivery electrick truck, Hino (72411).jpg
  - Urheber: Syced
  - Lizenz: CC0
  - Seite: https://commons.wikimedia.org/wiki/File:Yamato_delivery_electrick_truck,_Hino_(72411).jpg
  - Verwendet in: logistik-zaehlen
- `fotos/logistik-hafenhof-container.jpg`
  - Titel: Gfp-loading-dock.jpg
  - Urheber: Yinan Chen
  - Lizenz: Public Domain
  - Seite: https://commons.wikimedia.org/wiki/File:Gfp-loading-dock.jpg
  - Verwendet in: logistik-zaehlen
- `fotos/logistik-sattelzug-ladung.jpg`
  - Titel: Kenworth truck of the US Air Force.JPEG
  - Urheber: Shane Cuomo, U.S. Air Force
  - Lizenz: Public domain
  - Seite: https://commons.wikimedia.org/wiki/File:Kenworth_truck_of_the_US_Air_Force.JPEG
  - Verwendet in: logistik-zaehlen
- `fotos/logistik-kleintransporter-strasse.jpg`
  - Titel: US-type small delivery truck in Tokyo.jpeg
  - Urheber: Syced
  - Lizenz: CC0
  - Seite: https://commons.wikimedia.org/wiki/File:US-type_small_delivery_truck_in_Tokyo.jpeg
  - Verwendet in: logistik-zaehlen
- `fotos/handel-getraenkeregal.jpg`
  - Titel: Soft drink shelf.JPG
  - Urheber: SMC at English Wikipedia
  - Lizenz: Public domain
  - Seite: https://commons.wikimedia.org/wiki/File:Soft_drink_shelf.JPG
  - Verwendet in: handel-regal
- `fotos/handel-tassen-tisch.jpg`
  - Titel: Enamel cups on a table (Unsplash).jpg
  - Urheber: André Freitas andrekerygma
  - Lizenz: CC0
  - Seite: https://commons.wikimedia.org/wiki/File:Enamel_cups_on_a_table_(Unsplash).jpg
  - Verwendet in: handel-regal
- `fotos/handel-regal-luecken.jpg`
  - Titel: Covid - P1630413.jpg
  - Urheber: citytransportinfo
  - Lizenz: CC0
  - Seite: https://commons.wikimedia.org/wiki/File:Covid_-_P1630413.jpg
  - Verwendet in: handel-regal
- `fotos/baustelle-metro-pause.jpg`
  - Titel: A break for the construction workers at the Rokin at the building site of the future metro station underground; free photo of Amsterdam streets by Fons Heijnsbroek, 2007.jpg
  - Urheber: Fons Heijnsbroek
  - Lizenz: CC0
  - Seite: https://commons.wikimedia.org/wiki/File:A_break_for_the_construction_workers_at_the_Rokin_at_the_building_site_of_the_future_metro_station_underground;_free_photo_of_Amsterdam_streets_by_Fons_Heijnsbroek,_2007.jpg
  - Verwendet in: sicherheit-baustelle
- `fotos/baustelle-halle-montage.jpg`
  - Titel: Mockup - Shuttle Mid-Body - JSC (s76-21336).jpg
  - Urheber: NASA Johnson Space Center
  - Lizenz: Public domain
  - Seite: https://commons.wikimedia.org/wiki/File:Mockup_-_Shuttle_Mid-Body_-_JSC_(s76-21336).jpg
  - Verwendet in: sicherheit-baustelle
- `fotos/baustelle-neubau-ferne.jpg`
  - Titel: Moscow, new construction on the site of Olimpiysky hall September 2024 04.jpg
  - Urheber: Retired electrician
  - Lizenz: CC0
  - Seite: https://commons.wikimedia.org/wiki/File:Moscow,_new_construction_on_the_site_of_Olimpiysky_hall_September_2024_04.jpg
  - Verwendet in: sicherheit-baustelle

## Synthetische Bilder

Die Ordner `fertigung-sichtpruefung`, `fertigung-sortieren` und `gesundheit-auffaellig` enthalten ausschließlich per Code gezeichnete Bilder (Pillow, numpy, feste Seeds in `scripts/beispiele_bilder.py`). Es gibt keine fremde Vorlage, keine Personen und keine medizinischen Daten.

## Texte und Daten

- `buero-dokumente/*.txt` und `daten/bestellungen.json`: vollständig erfunden. Keine echten Firmen, Personen, Produkte oder Gesetze.

## Audio

- `audio/besprechung.mp3`: synthetische Stimme, erzeugt mit ElevenLabs (Modell eleven_v4, Stimme George) aus dem erfundenen Text in `audio/besprechung.txt`. Prüfe vor einer Weitergabe außerhalb dieses Projekts die Nutzungsbedingungen des verwendeten ElevenLabs-Tarifs.

## Messwerte

`pruefung.json` hält fest, wie die Beispiele mit denselben Modelldateien wie im Labor abgeschnitten haben. Gemessen wurde auf einem Entwicklungsrechner, nicht auf dem Jetson.
