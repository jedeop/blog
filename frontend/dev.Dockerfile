FROM node:14-alpine3.12

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 3000
CMD ["yarn", "dev"]