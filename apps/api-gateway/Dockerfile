FROM node:21-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build api-gateway

# CMD [ "npm", "run", "start:dev", "api-gateway" ]