FROM paperplanecc/baseline-node20-puppeteer:2025.11.30

EXPOSE 6100
WORKDIR /paperplane-web-console

ENV HUSKY=0
ENV DO_NOT_TRACK=1

COPY .docker-deps /paperplane-web-console
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm i --frozen-lockfile --store-dir /root/.local/share/pnpm/store

COPY . /paperplane-web-console
RUN pnpm build

CMD ["pnpm", "prod-start:server"]
