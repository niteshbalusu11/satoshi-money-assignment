FROM oven/bun:1 as build

WORKDIR /app
COPY . .
RUN bun install && bun run build

EXPOSE 3000
ENTRYPOINT [ "bun", "run", "start" ]
