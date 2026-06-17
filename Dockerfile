FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG MODE=""
RUN npm run build${MODE}

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /usr/share/nginx/html \
    && chown -R appuser:appgroup /var/cache/nginx \
    && chown -R appuser:appgroup /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown appuser:appgroup /var/run/nginx.pid
USER appuser
EXPOSE 80
