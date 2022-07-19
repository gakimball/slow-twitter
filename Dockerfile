FROM node:alpine

WORKDIR /usr/src/app

EXPOSE 8080
VOLUME /usr/src/app/public

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/* ./src/
RUN npm run build

COPY . .

CMD ["npm", "start"]
