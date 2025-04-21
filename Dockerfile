# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production # For npm

COPY . .

RUN npm run build

# Stage 2
FROM nginx:alpine

EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html