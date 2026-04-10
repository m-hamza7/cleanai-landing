"""
CleanAI - Waste Classification Microservice
Loads a YOLOv8 model and exposes an HTTP endpoint for image classification.
Runs on port 5001.
"""

import os
import sys
import urllib.request
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# ── Load model at startup ──────────────────────────────────────────
# Priority:
# 1) MODEL_PATH env var (recommended in hosted deployments)
# 2) /app/best.pt (Docker default)
# 3) Legacy repo path ../../model/best.pt for local development
MODEL_PATH = os.environ.get('MODEL_PATH', '/app/best.pt')
MODEL_URL = os.environ.get('MODEL_URL', '').strip()
DEFAULT_MODEL_URL = 'https://raw.githubusercontent.com/m-hamza7/cleanai-landing/main/model/best.pt'


def ensure_model_file(path: str) -> str:
    if os.path.exists(path):
        return path

    legacy_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '..', '..', 'model', 'best.pt')
    )
    if os.path.exists(legacy_path):
        return legacy_path

    download_url = MODEL_URL or DEFAULT_MODEL_URL
    if download_url:
        os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
        print(f"⬇️  MODEL_PATH not found. Downloading model from {download_url} to {path} ...")
        try:
            urllib.request.urlretrieve(download_url, path)
            print("✅ Model downloaded successfully")
            return path
        except Exception as err:
            raise FileNotFoundError(
                f"Failed to download model from '{download_url}': {err}"
            ) from err

    raise FileNotFoundError(
        f"Model not found at '{path}'. Set MODEL_PATH to a valid file or provide MODEL_URL."
    )


MODEL_PATH = ensure_model_file(MODEL_PATH)

print(f"🔄 Loading YOLO model from {MODEL_PATH} ...")
model = YOLO(MODEL_PATH, task='detect')
CLASS_NAMES = model.names  # {0: 'CARDBOARD/PAPER', 1: 'METAL', 2: 'BOTTLE/CUP', 3: 'PLASTIC'}
print(f"✅ Model loaded. Classes: {CLASS_NAMES}")


def estimate_severity(num_detections: int, total_area_ratio: float) -> str:
    """Estimate severity based on number of detections and area coverage."""
    if num_detections == 0:
        return "low"
    if num_detections >= 5 or total_area_ratio > 0.4:
        return "high"
    if num_detections >= 2 or total_area_ratio > 0.15:
        return "medium"
    return "low"


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "OK",
        "service": "CleanAI Waste Classifier",
        "model": os.path.basename(MODEL_PATH),
        "classes": CLASS_NAMES
    })


@app.route('/classify', methods=['POST'])
def classify():
    """
    Accepts an image (multipart/form-data with key 'image' OR a file path as JSON).
    Returns the dominant waste type, confidence, severity, and all detections.
    """
    try:
        image = None

        # Option 1: image file uploaded directly
        if 'image' in request.files:
            file = request.files['image']
            image = Image.open(io.BytesIO(file.read()))

        # Option 2: image_path sent as form field or JSON (backend calls with file path)
        elif request.form.get('image_path') or (request.is_json and request.json.get('image_path')):
            image_path = request.form.get('image_path') or request.json.get('image_path')
            if not os.path.exists(image_path):
                return jsonify({"error": f"Image not found: {image_path}"}), 404
            image = Image.open(image_path)
        else:
            return jsonify({"error": "No image provided. Send 'image' file or 'image_path'."}), 400

        # Run inference
        results = model(image, conf=0.25, verbose=False)

        img_w, img_h = image.size
        img_area = img_w * img_h

        detections = []
        class_confidences = {}  # class_name -> [confidence scores]
        total_box_area = 0

        for result in results:
            if result.boxes is not None:
                for box in result.boxes:
                    cls_id = int(box.cls[0])
                    conf = float(box.conf[0])
                    cls_name = CLASS_NAMES.get(cls_id, f"class_{cls_id}")

                    # Box area
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    box_area = (x2 - x1) * (y2 - y1)
                    total_box_area += box_area

                    detections.append({
                        "class": cls_name,
                        "confidence": round(conf, 4),
                        "bbox": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)]
                    })

                    if cls_name not in class_confidences:
                        class_confidences[cls_name] = []
                    class_confidences[cls_name].append(conf)

        # Determine dominant waste type (highest total confidence)
        if class_confidences:
            dominant_class = max(class_confidences, key=lambda c: sum(class_confidences[c]))
            avg_confidence = sum(class_confidences[dominant_class]) / len(class_confidences[dominant_class])
        else:
            dominant_class = "Unknown"
            avg_confidence = 0.0

        area_ratio = total_box_area / img_area if img_area > 0 else 0
        severity = estimate_severity(len(detections), area_ratio)

        response = {
            "waste_type": dominant_class,
            "confidence": round(avg_confidence, 4),
            "severity_level": severity,
            "num_detections": len(detections),
            "detections": detections,
            "all_types": {k: round(max(v), 4) for k, v in class_confidences.items()}
        }

        return jsonify(response)

    except Exception as e:
        print(f"❌ Classification error: {e}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Railway injects PORT; keep AI_SERVICE_PORT as optional fallback for local/dev.
    port = int(os.environ.get('PORT', os.environ.get('AI_SERVICE_PORT', 5001)))
    print(f"\n🧠 CleanAI Waste Classification Service starting on port {port}")
    print(f"   POST http://localhost:{port}/classify")
    print(f"   GET  http://localhost:{port}/health\n")
    app.run(host='0.0.0.0', port=port, debug=False)
