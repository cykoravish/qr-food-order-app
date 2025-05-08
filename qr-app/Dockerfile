# Dockerfile inside qr-app
FROM node:18-alpine as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Serve with nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Replace default nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf
