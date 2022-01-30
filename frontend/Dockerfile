FROM node:16-alpine3.14

WORKDIR /app

RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone \
    apk del tzdata

COPY package.json yarn.lock .yarnrc.yml .pnp.* ./
COPY .yarn .yarn
RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]