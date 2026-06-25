# build environment
FROM node:26.4.0-alpine AS builder

# Update npm to get patched tar version (fixes CVE-2026-26960)
RUN npm install -g npm@latest

WORKDIR /app

COPY package.json ./
COPY .npmrc ./

RUN npm install --force

ARG REACT_APP_VERSION=0.0.0.0
ENV REACT_APP_VERSION=${REACT_APP_VERSION}

COPY . ./
RUN npm run build

# production environment
FROM node:26.4.0-alpine

# Update npm to get patched tar version (fixes CVE-2026-26960)
RUN npm install -g npm@latest

ARG imageUser=appuser
ARG imageUserGroup=appgroup
ARG imageUserId=1375
ARG imageUserGroupId=1375

RUN addgroup --system --gid $imageUserGroupId $imageUserGroup && \
    adduser --system --uid $imageUserId --ingroup $imageUserGroup $imageUser

COPY --chown=$imageUser:$imageUserGroup --from=builder /app/build ./build
COPY --chown=$imageUser:$imageUserGroup --from=builder /app/setenv.js ./setenv.js

RUN npm install -g serve@14

USER $imageUser

EXPOSE 8080

CMD ["sh","-c","node setenv.js && serve -s build -p 8080"]
