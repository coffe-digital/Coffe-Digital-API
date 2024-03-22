FROM node:20.5.0-buster

WORKDIR /usr/src/api

COPY package*.json ./
COPY . . 

# COPY ./.env.production ./.env

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build

CMD ["npm", "run", "start:dev"]