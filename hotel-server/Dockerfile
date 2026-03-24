FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable 

WORKDIR /pre 
COPY . .

FROM base AS prod-deps 
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod 
RUN pnpm install --frozen-lockfile --prod

FROM node:20-alpine AS prod
ENV PNPM_HOME = "/pnpm"
ENV PATH = "$PNPM_HOME:$PATH"
RUN corepack enable 

WORKDIR /app
COPY --from=base /pre/. /app/
COPY --from=prod-deps /pre/node_modules /app/node_modules

EXPOSE 5005
CMD [ "pnpm", "run", "start" ]

#################
FROM node:20
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app # dif

COPY hotel-servidor/package.json hotel-servidor/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY hotel-servidor/. .

EXPOSE 5005
CMD ["pnpm", "run", "start"]
