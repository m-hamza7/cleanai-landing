FROM python:3.12-slim

WORKDIR /app

# Minimal runtime libs for scientific/python wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY classify.py ./

ENV MODEL_PATH=/app/best.pt
ENV YOLO_CONFIG_DIR=/tmp/Ultralytics
ENV PYTHONUNBUFFERED=1

# Use shell form so $PORT (injected by Render) is expanded at runtime.
# Falls back to 5001 for local/Docker Compose usage.
CMD gunicorn --workers=2 --threads=4 --bind=0.0.0.0:${PORT:-5001} --timeout=120 classify:app
