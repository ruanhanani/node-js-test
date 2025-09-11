# Single-stage Dockerfile for Node.js Task Manager API
# Note: Assumes TypeScript is already compiled locally

FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy pre-built application
COPY --chown=nextjs:nodejs dist/ ./dist/

# Copy necessary files
COPY --chown=nextjs:nodejs start.js ./
COPY --chown=nextjs:nodejs start-docker.js ./
COPY --chown=nextjs:nodejs tsconfig.json ./
COPY --chown=nextjs:nodejs scripts/seed_database.js ./scripts/
COPY --chown=nextjs:nodejs docker/ ./docker/

# Create logs and scripts directories
RUN mkdir -p logs scripts && chown nextjs:nodejs logs scripts

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start command with tsconfig-paths
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]
