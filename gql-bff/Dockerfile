FROM node:26.4.0-alpine

# Create app direcqtory
WORKDIR /usr/src/app

# Update npm to get patched tar version (fixes CVE-2026-26960)
RUN npm install -g npm@latest

ARG imageUser=appuser
ARG imageUserGroup=appgroup
ARG imageUserId=1375
ARG imageUserGroupId=1375

RUN addgroup --system --gid $imageUserGroupId $imageUserGroup && \     
    adduser --system --uid $imageUserId --ingroup $imageUserGroup $imageUser

# Install app dependencies
COPY --chown=$imageUser:$imageUserGroup package.json package-lock.json ./

RUN npm install && \
    find node_modules -name "package-lock.json" -not -path "*/node_modules/node_modules/*" -delete

# Remove npm's own bundled undici (CVE-2026-12151). It is only used for npm
# registry network calls, which are complete by this point; `npm run` does not
# need it, so the runtime CMD is unaffected.
RUN rm -rf /usr/local/lib/node_modules/npm/node_modules/undici

# Bundle app source.

COPY --chown=$imageUser:$imageUserGroup . .


USER $imageUser

EXPOSE 4000


CMD ["/bin/sh", "-c", "test -f /vault/secrets/credentials.vault && echo 'INFO: Vault credentials loaded.' && \
    source /vault/secrets/credentials.vault || echo 'INFO: Vault file not loaded.' && npm run start:production"]
