FROM ghcr.io/hazmi35/node:21-alpine as build-stage

WORKDIR /tmp/build

RUN corepack enable && corepack prepare pnpm@latest

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm run build

RUN pnpm prune --production

FROM ghcr.io/hazmi35/node:21-alpine

RUN corepack enable && corepack prepare pnpm@latest

COPY --from=build-stage /tmp/build/package.json .
COPY --from=build-stage /tmp/build/pnpm-lock.yaml .
COPY --from=build-stage /tmp/build/node_modules ./node_modules
COPY --from=build-stage /tmp/build/.next .next
COPY --from=build-stage /tmp/build/next.config.mjs ./next.config.mjs
COPY --from=build-stage /tmp/build/public ./public

CMD ["pnpm", "run", "start"]