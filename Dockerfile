## Use lightweight Node.js Alpine image
#FROM node:20-alpine
#
## Set working directory
#WORKDIR /app
#
## Install required tools
#RUN apk update && apk add --no-cache bash
#
## Copy package.json and package-lock.json first for caching
#COPY package*.json ./
#
## Install dependencies and PM2 globally
#RUN npm install && npm install -g pm2
#
## Copy the rest of the application files
#COPY . .
#
## Run the build step if it exists
#RUN npm run build || echo "Skipping build step"
#
## Expose the necessary port
#EXPOSE 3200
#
## Start the app with PM2
#CMD ["pm2-runtime", "start", "pm2.config.js", "--env", "production"]
# Use lightweight Node.js Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install media processing dependencies
RUN apk update && apk add --no-cache \
    graphicsmagick \
    ffmpeg


# Verify installations (optional debug step)
RUN echo "Media processing tools installed:" && \
    gm -version && \
    ffmpeg -version

# Install required tools
RUN apk add --no-cache bash

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies and PM2 globally
RUN npm install && npm install -g pm2

# Copy the rest of the application files
COPY . .

# Run the build step if it exists
RUN npm run build || echo "Skipping build step"

# Expose the necessary port
EXPOSE 3200

# Start the app with PM2
CMD ["pm2-runtime", "start", "pm2.config.js", "--env", "production"]