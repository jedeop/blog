FROM node:14-alpine3.12

WORKDIR /app

RUN wget https://github.com/IBM/plex/releases/download/v5.1.3/Web.zip -O plex.zip \
    && mkdir dist \
    && unzip plex.zip "Web/IBM-Plex-Sans-KR/*" -d ./dist -q \
    && unzip plex.zip "Web/css/ibm-plex-sans-kr.min.css" -d ./dist -q \
    && rm plex.zip 

COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]