# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

ARG GH_PACKAGES_TOKEN
RUN if [ -n "GH_PACKAGES_TOKEN" ]; then \
      echo "//npm.pkg.github.com/:_authToken=GH_PACKAGES_TOKEN" > .npmrc && \
      echo "@antpas14:registry=https://npm.pkg.github.com/" >> .npmrc; \
    fi

RUN npm ci --only=production # For npm

COPY . .

RUN npm run build

# Stage 2
FROM nginx:alpine

EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html