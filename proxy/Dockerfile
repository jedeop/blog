FROM nginx:alpine

RUN wget https://github.com/IBM/plex/releases/download/v5.1.3/Web.zip -O plex.zip \
    && mkdir /data \
    && unzip plex.zip "Web/IBM-Plex-Sans-KR/*" -d /data -q \
    && unzip plex.zip "Web/css/ibm-plex-sans-kr.min.css" -d /data -q \
    && mv /data/Web /data/fonts \
    && rm plex.zip 

COPY ./data /data
COPY ./nginx.conf /etc/nginx/nginx.conf