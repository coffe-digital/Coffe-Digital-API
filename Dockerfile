FROM node:20.5.0-buster

WORKDIR /usr/src/api

COPY package*.json ./


# COPY ./.env.production ./.env

RUN npm install 
# --quiet --no-optional --no-fund --loglevel=error

COPY . . 

# Definir permissões para os arquivos copiados
# RUN chmod -R 777 .
RUN chown -R node:node /usr/src/api
RUN chmod -R 777 /usr/src/api

# Definir permissões para os arquivos copiados
# COPY init.sh /usr/src/api/init.sh
# RUN chmod +x /usr/src/api/init.sh
# RUN /usr/src/api/init.sh

RUN npm run build

CMD ["npm", "run", "start:dev"]