FROM node:14-alpine

RUN apk add --no-cache git

WORKDIR /messenger

COPY . .

EXPOSE 3000

RUN yarn --production

RUN yarn build

RUN rm -R src .github .gh-build .env-template .docker .dh-build .cdk8s

CMD yarn start:prod
