FROM node:14-slim

WORKDIR /usr/app

COPY ./package*.json ./
COPY ./yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]