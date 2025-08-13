# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

# Production image
FROM alpine:3.19
WORKDIR /app

RUN apk add --update nodejs npm git

COPY --from=build /app/compiled/directus-extension-installer-alpine /usr/local/bin/install-directus-extensions
RUN chmod +x /usr/local/bin/install-directus-extensions
ENTRYPOINT ["/bin/sh"]
