FROM caddy:2.3.0-alpine

ADD https://github.com/orioncactus/pretendard/releases/download/v1.2.1/Pretendard-1.2.1.zip /font.zip
RUN unzip /font.zip web/variable/pretendardvariable.css web/variable/woff2/PretendardVariable.woff2 -d /srv \
    && mv /srv/web/variable /srv/fonts \
    && rm -r /font.zip /srv/web 

COPY ./data /srv
COPY ./Caddyfile /etc/caddy/Caddyfile