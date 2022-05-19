FROM node:14-alpine

RUN apk add --no-cache git

WORKDIR /messenger

COPY . .

EXPOSE 3000

RUN yarn --production
ARG APP_ENV
RUN chmod u+x .gh-build/development-build && .gh-build/development-build $APP_ENV
RUN yarn build

RUN rm -R src .docker .cdk8s .gh-build

CMD yarn start:prod
