FROM node:alpine

WORKDIR /usr/src/app

EXPOSE 8080
VOLUME /usr/src/app/public

COPY package*.json ./
RUN npm ci --only=production
COPY . .

CMD ["node", "index.js"]
