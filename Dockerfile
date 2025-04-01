FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add --no-cache \
    graphicsmagick \
    ffmpeg

RUN echo "Media processing tools installed:" && \
    gm -version && \
    ffmpeg -version

RUN apk add --no-cache bash

COPY package*.json ./

RUN npm install && npm install -g pm2

COPY . .

RUN npm run build || echo "Skipping build step"

EXPOSE 3200

CMD ["pm2-runtime", "start", "pm2.config.js", "--env", "production"]