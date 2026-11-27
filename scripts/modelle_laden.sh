#!/bin/bash
# Laedt die Hand-/Gesichts-, Koerper- und Freistell-Modelle (OpenCV Zoo) nach app/models/. Die Handnetze nutzt auch das Labor Fingeralphabet (keine eigenen Modelle). Aufruf aus scripts/setup.sh; einzeln jederzeit wiederholbar.
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
ls -la app/models/*.onnx
