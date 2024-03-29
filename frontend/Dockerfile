FROM oven/bun:1 as build

WORKDIR /app
COPY . .
RUN bun install && bun run build


# FROM oven/bun:1 as release

# WORKDIR /app

# COPY package.json bun.lockb ./
# COPY --from=build /app/dist dist/
# RUN bun install --frozen-lockfile --production


EXPOSE 3000
ENTRYPOINT [ "bun", "run", "preview" ]
