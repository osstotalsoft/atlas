FROM node:26.13.0-alpine

# Create app direcqtory
WORKDIR /usr/src/app

ARG imageUser=appuser
ARG imageUserGroup=appgroup
ARG imageUserId=1375
ARG imageUserGroupId=1375

RUN addgroup --system --gid $imageUserGroupId $imageUserGroup && \     
    adduser --system --uid $imageUserId --ingroup $imageUserGroup $imageUser

# Install app dependencies
COPY --chown=$imageUser:$imageUserGroup package.json package-lock.json ./

# Production dependencies only: jest and the graphql-mesh CLI (with its express,
# graphql-upload/dicer and codegen trees) are not used at runtime.
RUN npm ci --omit=dev && \
    find node_modules -name "package-lock.json" -not -path "*/node_modules/node_modules/*" -delete

# Remove npm itself (and its bundled undici, tar, glob, minimatch, ...). It is
# only needed for the install above; the runtime CMD runs node directly.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Bundle app source.

COPY --chown=$imageUser:$imageUserGroup . .


USER $imageUser

EXPOSE 4000


CMD ["/bin/sh", "-c", "test -f /vault/secrets/credentials.vault && echo 'INFO: Vault credentials loaded.' && \
    source /vault/secrets/credentials.vault || echo 'INFO: Vault file not loaded.' && NODE_ENV=production node src/index.js"]
