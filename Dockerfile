FROM node:17-slim

WORKDIR /app

COPY package.json .
RUN npm install

EXPOSE 8080