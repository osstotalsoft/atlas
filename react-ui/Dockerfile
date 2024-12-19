# build environment
FROM node:20.18.1-bullseye as builder
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
FROM node:20.18.1-bullseye

ARG imageUser=appuser
ARG imageUserGroup=appgroup
ARG imageUserId=1375
ARG imageUserGroupId=1375

RUN addgroup --system --gid $imageUserGroupId $imageUserGroup && \     
    adduser --system --uid $imageUserId --ingroup $imageUserGroup $imageUser

COPY --chown=$imageUser:$imageUserGroup --from=builder /app/build ./build
COPY --chown=$imageUser:$imageUserGroup --from=builder /app/setenv.js ./setenv.js

RUN yarn global add serve@6

USER $imageUser

EXPOSE 8080

CMD ["sh","-c","node setenv.js && serve -s build -p 8080"]
