# --- Stage 1: Build React app ---
FROM node:22.21 AS builder
WORKDIR /app
# Copy dependency files
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy all app files (React + Express)
COPY . .
# Build React app
RUN npm run build
# Diagnostic: confirm build output exists
RUN echo "✅ Build output:" && ls -l /app/build

# --- Stage 2: Run server ---
FROM node:22.21
WORKDIR /app
# Copy only needed files from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose application port
EXPOSE 8080

# Start the Node server
CMD ["node", "server.js"]