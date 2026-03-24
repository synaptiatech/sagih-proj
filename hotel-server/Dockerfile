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
