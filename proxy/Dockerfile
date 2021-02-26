FROM caddy:2.3.0-alpine

RUN wget https://github.com/IBM/plex/releases/download/v5.1.3/Web.zip -O plex.zip \
    && unzip plex.zip "Web/IBM-Plex-Sans-KR/*" -d /srv -q \
    && unzip plex.zip "Web/css/ibm-plex-sans-kr.min.css" -d /srv -q \
    && mv /srv/Web /srv/fonts \
    && rm plex.zip 

COPY ./data /srv
COPY ./Caddyfile /etc/caddy/Caddyfile