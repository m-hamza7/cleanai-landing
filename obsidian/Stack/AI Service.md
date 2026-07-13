---
tags:
  - cleanai
  - stack
  - ai
  - yolo
---

# AI Service

Flask microservice that runs **Ultralytics YOLOv8** for waste classification.

## Location

`backend/ai-service/`

| File | Purpose |
|------|---------|
| `classify.py` | Flask app + inference |
| `requirements.txt` | Torch CPU, ultralytics, pillow, gunicorn |
| `Dockerfile` | Container build (also used as reference) |

## Endpoints

| Method | Path | Body |
|--------|------|------|
| `GET` | `/health` | — |
| `POST` | `/classify` | multipart `image` **or** `image_path` |

Default local port: **5001**.

## Model

| Item | Detail |
|------|--------|
| Weights | `model/best.pt` (~52 MB) |
| Override | `MODEL_PATH` / `MODEL_URL` env |
| Fallback URL | GitHub raw `best.pt` on `main` |

### Detection classes

- `CARDBOARD/PAPER`
- `METAL`
- `BOTTLE/CUP`
- `PLASTIC`

### Severity

Heuristic from detection count + bounding-box area ratio → `low` / `medium` / `high`. Persisted in `ai_classification.severity_level`.

## Local run

```bash
cd backend/ai-service
pip install -r requirements.txt
python classify.py
```

Render production uses `gunicorn` (see [[Deployment]]).

## Related

- [[Data Flow]]
- [[Reports API]]
- [[Tech Stack]]
