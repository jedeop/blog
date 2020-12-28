FROM rust:1.48 as planner

WORKDIR /app
RUN cargo install cargo-chef
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM rust:1.48 as cacher

WORKDIR /app

RUN cargo install cargo-chef
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --recipe-path recipe.json

FROM rust:1.48 as builder

WORKDIR /app

COPY . .
COPY --from=cacher /app/target target
COPY --from=cacher $CARGO_HOME $CARGO_HOME

RUN cargo build

FROM debian:buster-slim as runtime

RUN apt-get update \
    && apt-get install -y libssl-dev wget unzip fontconfig
    
RUN wget https://github.com/IBM/plex/releases/download/v5.1.3/OpenType.zip -O plex.zip \
    && unzip plex.zip "OpenType/IBM-Plex-Sans-KR/*" \
    && mv OpenType /usr/share/fonts/opentype/ \
    && rm plex.zip \
    && fc-cache -f -v
    
RUN apt-get remove -y wget unzip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/debug/blog /usr/local/bin/

EXPOSE 7878
ENTRYPOINT ["blog"]