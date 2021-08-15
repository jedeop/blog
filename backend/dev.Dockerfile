FROM rust:1.54 as builder

RUN cargo new --bin app
WORKDIR ./app
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build
RUN rm src/*.rs

COPY . ./
RUN rm ./target/debug/deps/blog*
RUN cargo build

FROM debian:buster-slim as runtime

RUN apt-get update \
    && apt-get install -y ca-certificates tzdata curl fontconfig unzip
    
ADD https://github.com/orioncactus/pretendard/releases/download/v1.1.1/Pretendard-1.1.1.zip /font.zip
RUN unzip font.zip "public/static/Pretendard*" -d /usr/local/share/fonts \
    && rm /font.zip \
    && fc-cache -f -v
    
RUN apt-get remove -y fontconfig unzip \
    && rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Seoul

COPY --from=builder /app/target/debug/blog /usr/local/bin/

EXPOSE 7878
ENTRYPOINT ["blog"]