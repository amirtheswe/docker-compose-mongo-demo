FROM node:20-alpine

WORKDIR /home/app

# Copy the dependency files first. Docker reuses the cached npm layer
# until package.json or package-lock.json change, so rebuilds stay fast.
COPY --chown=node:node app/package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node app/ ./

ENV NODE_ENV=production
EXPOSE 3000

# Run as the unprivileged user that ships with the node image, not root.
USER node

# The app waits for MongoDB for up to 45 seconds before it starts listening.
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget -qO- http://localhost:3000/ > /dev/null || exit 1

CMD ["node", "server.js"]
