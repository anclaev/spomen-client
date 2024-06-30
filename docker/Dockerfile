# Stage 1: Сборка проекта
FROM node:18-alpine AS build
WORKDIR /app
ARG build_env=build

COPY package.json yarn.lock*  ./

RUN yarn install --frozen-lockfile --production
RUN yarn add -D @angular/cli

COPY . .

RUN yarn $build_env

# Stage 2: Запуск приложения
FROM nginx:1.17.1-alpine AS runtime

COPY --from=build /app/dist/spomen/client/browser /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]
