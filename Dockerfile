## base #############################################################################################
FROM node:20.15.0-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /usr/src
WORKDIR /usr/src
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -w --frozen-lockfile

## dev #############################################################################################
FROM base AS app-dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter @larky-link/app install --frozen-lockfile

EXPOSE 8080

ENTRYPOINT ["pnpm", "exec", "nx", "run"]
CMD ["@larky-link/app:dev"]

## build #########################################################################################
FROM base AS app-build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter @larky-link/app install --frozen-lockfile
# To expose custom env variables to the browser, declare them with the prefix NEXT_PUBLIC_.
# doc: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
ARG DATABASE_URL
ARG UPSTASH_REDIS_REST_URL
ARG UPSTASH_REDIS_REST_TOKEN
ENV DATABASE_URL $DATABASE_URL
ENV UPSTASH_REDIS_REST_URL $UPSTASH_REDIS_REST_URL
ENV UPSTASH_REDIS_REST_TOKEN $UPSTASH_REDIS_REST_TOKEN
RUN pnpm exec nx run @larky-link/app:build
RUN pnpm deploy --filter=app --prod /prod/app

## prod ############################################################################################
FROM node:20.15.0-alpine AS app
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=app-build --chown=nextjs:nodejs /prod/app/next.config.js ./
COPY --from=app-build --chown=nextjs:nodejs /prod/app/public ./public
COPY --from=app-build --chown=nextjs:nodejs /prod/app/.next ./.next
COPY --from=app-build --chown=nextjs:nodejs /prod/app/node_modules ./node_modules
COPY --from=app-build --chown=nextjs:nodejs /prod/app/package.json ./package.json
USER nextjs
ARG PORT
ENV PORT=$PORT
EXPOSE ${PORT}
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["sh", "-c", "node_modules/.bin/next start -p ${PORT}"]
