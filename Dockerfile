FROM paperplanecc/paperplane-api-base:1.1.0

ARG NPM_REGISTRY=https://registry.npmjs.org

EXPOSE 6100
WORKDIR /paperplane-web-console

COPY ./out/json /paperplane-web-console
RUN pnpm i --frozen-lockfile --registry=$NPM_REGISTRY

COPY . /paperplane-web-console
RUN pnpm build:server

CMD ["pnpm", "-F", "@repo/server", "run", "start:prod"]
