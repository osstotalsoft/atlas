# build environment
FROM node:20-alpine3.20 as builder

# Update npm to get patched tar version (fixes CVE-2026-26960)
RUN npm install -g npm@latest

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./

RUN corepack enable
RUN yarn install

RUN yarn set version 3.5.0
COPY .yarnrc.yml ./
RUN yarn install

ARG REACT_APP_VERSION=0.0.0.0
ENV REACT_APP_VERSION=${REACT_APP_VERSION}

COPY . ./
RUN yarn run build

# production environment
FROM node:current-alpine3.23

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

RUN yarn global add serve@14

USER $imageUser

EXPOSE 8080

CMD ["sh","-c","node setenv.js && serve -s build -p 8080"]
