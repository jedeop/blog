FROM node:14-alpine3.12

WORKDIR /app

ADD https://github.com/IBM/plex/releases/download/v5.1.3/Web.zip .
RUN mkdir dist && unzip ./Web.zip -d ./dist -q && rm -rf ./Web.zip

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 3000
CMD ["yarn", "dev"]