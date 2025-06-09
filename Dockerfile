# Stage 1: Build
FROM node:22.12.0-alpine AS builder

WORKDIR /app

# Copy package files and install deps first (cached if unchanged)
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Optional: Build only if needed
RUN npm run build

# Stage 2: Runtime (dev)
FROM node:22.12.0-alpine

WORKDIR /app

# Copy only deps and source
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "dev"]