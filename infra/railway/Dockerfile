FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl jq ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10 @anthropic-ai/claude-code

# Claude Code CLI refuses --permission-mode bypassPermissions as root,
# so the pipeline runs as an unprivileged user.
RUN useradd -m -s /bin/bash jsj
USER jsj
WORKDIR /home/jsj

# Prime the pnpm store at image build time so runtime install is offline-fast.
# Runs as jsj so the store lands at /home/jsj/.local/share/pnpm/store where
# the runtime install will look.
COPY --chown=jsj:jsj package.json pnpm-lock.yaml pnpm-workspace.yaml /home/jsj/prefetch/
RUN cd /home/jsj/prefetch && pnpm fetch --frozen-lockfile && cd /home/jsj && rm -rf prefetch

USER root
COPY infra/railway/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER jsj
WORKDIR /home/jsj
CMD ["/entrypoint.sh"]
