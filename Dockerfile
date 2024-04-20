FROM node:20.5.0-buster AS builder

WORKDIR /usr/src/api

# COPY package*.json ./

# RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

# COPY . .

# RUN npm run build

# FROM node:20.5.0-buster

# WORKDIR /usr/src/api

# COPY --from=builder /usr/src/api/node_modules ./node_modules

# COPY --from=builder /usr/src/api .

CMD ["npm", "run", "start:docker:dev"]
