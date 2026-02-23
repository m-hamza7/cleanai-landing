"""
CleanAI - Waste Classification Microservice
Loads a YOLOv8 model and exposes an HTTP endpoint for image classification.
Runs on port 5001.
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# ── Load model at startup ──────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'model', 'best.pt')
MODEL_PATH = os.path.abspath(MODEL_PATH)

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
    port = int(os.environ.get('AI_SERVICE_PORT', 5001))
    print(f"\n🧠 CleanAI Waste Classification Service starting on port {port}")
    print(f"   POST http://localhost:{port}/classify")
    print(f"   GET  http://localhost:{port}/health\n")
    app.run(host='0.0.0.0', port=port, debug=False)
