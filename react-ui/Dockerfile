# build environment
FROM node:26.13.0-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY .npmrc ./

RUN npm install --force

ARG REACT_APP_VERSION=0.0.0.0
ENV REACT_APP_VERSION=${REACT_APP_VERSION}

COPY . ./
RUN npm run build

# production environment
FROM node:26.13.0-alpine

ARG imageUser=appuser
ARG imageUserGroup=appgroup
ARG imageUserId=1375
ARG imageUserGroupId=1375

RUN addgroup --system --gid $imageUserGroupId $imageUserGroup && \
    adduser --system --uid $imageUserId --ingroup $imageUserGroup $imageUser

COPY --chown=$imageUser:$imageUserGroup --from=builder /app/build ./build
COPY --chown=$imageUser:$imageUserGroup --from=builder /app/setenv.js ./setenv.js

# serve@14 pins compression 1.8.1 (GHSA-vc2v-76pw-4v95). A global install cannot
# apply overrides, so install it from a manifest that can.
RUN mkdir -p /opt/serve && cd /opt/serve && \
    echo '{"private":true,"dependencies":{"serve":"^14.2.6"},"overrides":{"compression":"^1.8.2"}}' > package.json && \
    npm install --omit=dev

ENV PATH="/opt/serve/node_modules/.bin:${PATH}"

# Remove npm itself (and its bundled undici, tar, glob, minimatch, ...). It is
# only needed for the install above; the runtime CMD uses node and serve.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

USER $imageUser

EXPOSE 8080

CMD ["sh","-c","node setenv.js && serve -s build -p 8080"]
