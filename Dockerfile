FROM node:8-alpine

RUN apk --no-cache add openssl
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 \
  && chmod +x /usr/local/bin/dumb-init

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --frozen-lockfile && yarn cache clean
COPY . /usr/src/app

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD ["node", "index.js"]
