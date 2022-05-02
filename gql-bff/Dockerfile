FROM node:14.15-buster

# Create app directory
WORKDIR /usr/src/app

ARG imageUser=appuser
ARG imageUserGroup=appgroup
ARG imageUserId=1375
ARG imageUserGroupId=1375

RUN addgroup --system --gid $imageUserGroupId $imageUserGroup && \     
    adduser --system --uid $imageUserId --ingroup $imageUserGroup $imageUser

# Install app dependencies
COPY --chown=$imageUser:$imageUserGroup package.json ./
COPY yarn.lock ./

RUN yarn install
# If you are building your code for production
# RUN yarn install --only=production

# Bundle app source
COPY --chown=$imageUser:$imageUserGroup . .

USER $imageUser

EXPOSE 4000


CMD ["/bin/bash", "-c", "test -f /vault/secrets/credentials.vault && echo 'INFO: Vault credentials loaded.' && \
    source /vault/secrets/credentials.vault || echo 'INFO: Vault file not loaded.' && yarn start --config-env production"]
