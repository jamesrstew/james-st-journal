FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl jq ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10 @anthropic-ai/claude-code

# Prime the pnpm store at image build time so the runtime install is offline-fast.
# We copy only the lockfile + manifest from the repo so a code change doesn't bust this layer.
WORKDIR /tmp/prefetch
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --frozen-lockfile && rm -rf /tmp/prefetch

WORKDIR /
COPY infra/railway/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
