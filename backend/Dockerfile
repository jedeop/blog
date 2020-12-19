FROM rust:1.48 as planner

WORKDIR /app
RUN cargo install cargo-chef
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM rust:1.48 as cacher

WORKDIR /app

RUN cargo install cargo-chef
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

FROM rust:1.48 as builder

WORKDIR /app

COPY . .
COPY --from=cacher /app/target target
COPY --from=cacher $CARGO_HOME $CARGO_HOME

RUN cargo build --release

FROM debian:buster-slim as runtime

ENV DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_USER}

RUN apt-get update \
    && apt-get install -y libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/blog /usr/local/bin/

EXPOSE 7878
ENTRYPOINT ["blog"]