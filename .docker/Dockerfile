FROM node:12-alpine

RUN apk add --no-cache git

WORKDIR /messenger

COPY . .

EXPOSE 3000

RUN yarn --production
RUN yarn build

RUN rm -R src docker

CMD yarn start:prod
