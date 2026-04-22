### Stage 1 — build React frontend ###
FROM node:22-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# vite outDir is '../backend/frontend_dist' (relative to /app/frontend)
RUN mkdir -p /app/backend && npm run build


### Stage 2 — Django runtime ###
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/backend

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

# Copy the compiled frontend assets from stage 1
COPY --from=frontend-build /app/backend/frontend_dist ./frontend_dist

# Startup script handles migrate + collectstatic at runtime (env vars available then)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/docker-entrypoint.sh"]
