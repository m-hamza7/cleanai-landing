FROM python:3.12-slim

WORKDIR /app

# Minimal runtime libs for scientific/python wheels.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY classify.py ./

# Model is expected at /app/best.pt by default.
ENV MODEL_PATH=/app/best.pt
ENV PYTHONUNBUFFERED=1

CMD ["python", "classify.py"]
