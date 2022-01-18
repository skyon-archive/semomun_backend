FROM node:17-slim

WORKDIR /app

COPY . .
RUN npm install

CMD ["node", "server.js"]