FROM paperplanecc/paperplane-api-base:1.2.0

EXPOSE 6100
WORKDIR /paperplane-web-console

ENV HUSKY=0
ENV DO_NOT_TRACK=1

COPY .docker-deps /paperplane-web-console
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm i --offline

COPY . /paperplane-web-console
RUN pnpm build

CMD ["pnpm", "prod-start:server"]
