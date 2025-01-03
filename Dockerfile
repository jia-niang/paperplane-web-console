FROM paperplanecc/paperplane-api-base:1.1.0

ARG NPM_REGISTRY=https://registry.npmjs.org

EXPOSE 6100
WORKDIR /paperplane-web-console

ENV HUSKY=0

COPY .deps /paperplane-web-console
RUN --mount=type=cache,id=pnpm,target=/paperplane-web-console/.pnpm-store pnpm i --frozen-lockfile --registry=$NPM_REGISTRY

COPY . /paperplane-web-console
RUN pnpm build

CMD ["pnpm", "prod-start:server"]
