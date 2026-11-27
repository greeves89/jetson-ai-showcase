#!/bin/bash
# Laedt die Hand-/Gesichts-, Koerper- und Freistell-Modelle (OpenCV Zoo) nach app/models/. Dazu die Text-Lese-Modelle (PaddleOCR) fuer das Labor Text auf Papier lesen. Die Handnetze nutzt auch das Labor Fingeralphabet (keine eigenen Modelle). Aufruf aus scripts/setup.sh; einzeln jederzeit wiederholbar.
# Quellen und Lizenzen: Seite /lizenzen (Apache-2.0, Modelle aus github.com/opencv/opencv_zoo).
set -e
cd "$(dirname "$0")/.."
mkdir -p app/models
ZOO=https://github.com/opencv/opencv_zoo/raw/main/models
laden() {   # laden <Ordner im Zoo> <Dateiname im Zoo>
  if [ ! -f "app/models/$2" ]; then
    echo "laedt $2"
    curl -sS -m 120 -L -o "app/models/$2.teil" "$ZOO/$1/$2" && mv "app/models/$2.teil" "app/models/$2"
  fi
}
laden palm_detection_mediapipe palm_detection_mediapipe_2023feb.onnx
laden handpose_estimation_mediapipe handpose_estimation_mediapipe_2023feb.onnx
laden facial_expression_recognition facial_expression_recognition_mobilefacenet_2022july.onnx
laden human_segmentation_pphumanseg human_segmentation_pphumanseg_2023mar.onnx
laden person_detection_mediapipe person_detection_mediapipe_2023mar.onnx      # Labor Koerperhaltung
laden pose_estimation_mediapipe pose_estimation_mediapipe_2023mar.onnx
# Text auf Papier lesen: Zeilenfinder aus dem OpenCV Zoo (Apache-2.0, PaddleOCR PP-OCRv3)
laden text_detection_ppocr text_detection_en_ppocrv3_2023may.onnx
# Zeichenerkenner und Zeichenliste: PaddleOCR PP-OCRv5 fuer lateinische Schrift (Apache-2.0), ONNX-Umwandlung von monkt auf Hugging Face.
# Weil die Umwandlung nicht vom Urheber stammt, sind Stand (Commit) und Pruefsumme fest eingetragen.
HF=https://huggingface.co/monkt/paddleocr-onnx/resolve/7b02d0a30a07ba2b92ad1ff5a8941ae2c633de65
pruefsumme() { if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }
laden_fest() {   # laden_fest <Pfad im Repo> <Zieldatei> <sha256>
  if [ ! -f "app/models/$2" ]; then
    echo "laedt $2"
    curl -sS -m 180 -L -o "app/models/$2.teil" "$HF/$1" || true
    if [ -f "app/models/$2.teil" ] && [ "$(pruefsumme "app/models/$2.teil")" = "$3" ]; then mv "app/models/$2.teil" "app/models/$2"
    else rm -f "app/models/$2.teil"; echo "WARNUNG: $2 nicht geladen oder Pruefsumme falsch, das Labor Text auf Papier lesen bleibt aus"; fi
  fi
}
laden_fest languages/latin/rec.onnx ocr_latin_ppocrv5_rec_mobile.onnx 614ffc2d6d3902d360fad7f1b0dd455ee45e877069d14c4e51a99dc4ef144409
laden_fest languages/latin/dict.txt ocr_latin_ppocrv5_dict.txt 3c0a8a79b612653c25f765271714f71281e4e955962c153e272b7b8c1d2b13ff
ls -la app/models/*.onnx
