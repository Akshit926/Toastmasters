# ── Stage 1: Install production dependencies ──────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only the backend package manifests first (layer-cache optimisation)
COPY backend/package*.json ./

# Install production deps only (no devDependencies)
RUN npm install --omit=dev

# ── Stage 2: Final image ───────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the backend source
COPY backend/ ./

# Copy the frontend static files
COPY frontend/ ./frontend/

# Cloud Run injects PORT automatically; default to 8080
EXPOSE 8080

# Run as non-root for better security
USER node

CMD ["node", "server.js"]
