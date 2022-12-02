# Stage 1: Compile and build angular codebase

FROM node:16-bullseye-slim as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN yarn

RUN yarn build

# Stage 2: Serve app with caddy

FROM caddy:alpine

COPY ./Caddyfile /etc/caddy/Caddyfile

COPY --from=build /usr/local/app/dist/angular-weight-watch-ui /var/www/html

CMD export PORT="${PORT:-80}" \ 
    && caddy run --config /etc/caddy/Caddyfile
