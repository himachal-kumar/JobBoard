# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:20-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app/backend

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodejs:nodejs . .

# Create necessary directories
RUN mkdir -p uploads logs && \
    chown -R nodejs:nodejs uploads logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["npm", "run", "prod"]

# Development stage (optional)
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app/backend

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy application source
COPY . .

# Create necessary directories
RUN mkdir -p uploads logs

# Expose port
EXPOSE 5000

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application in development mode
CMD ["npm", "run", "dev"]
