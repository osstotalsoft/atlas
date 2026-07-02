// env
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  const path = `.env`;
  dotenv.config({ path });
}

if (process.env.NODE_ENV) {
  dotenv.config({ path: `./.env.${process.env.NODE_ENV}`, override: true });
}

const keyPerFileEnv = require("@totalsoft/key-per-file-configuration");
keyPerFileEnv.load();

const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express4");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("@apollo/server/plugin/landingPage/default");

const { v4 } = require("uuid");

// MultiTenancy
const { introspectionRoute } = require("./utils/functions");

// Logging
const { initializeDbLogging } = require("./plugins/logging/loggingUtils");
const loggingPlugin = require("./plugins/logging/loggingPlugin");
const plugins = [loggingPlugin];

const app = express();
const port = process.env.PORT || 5000;

const {
  jwtTokenValidation,
  errorHandlingMiddleware,
  tenantIdentification,
  jwtTokenUserIdentification,
} = require("./middleware");

const hasAuthConf =
  process.env.IDENTITY_AUTHORITY && process.env.IDENTITY_OPENID_CONFIGURATION;

// Skip auth for introspection requests or when no auth is configured.
const skipAuth = (req) => introspectionRoute(req) || !hasAuthConf;
const guard = (middleware) => (req, res, next) =>
  skipAuth(req) ? next() : middleware(req, res, next);

const { elastic } = require("./elasticSearch");
const { initElastic } = require("./elasticSearch/client");
const { getDataSources } = require("./startup/dataSources");

async function main() {
  const { getMesh } = require("@graphql-mesh/runtime");
  const { findAndParseConfig } = require("@graphql-mesh/config");

  await initElastic();

  const meshConfig = await findAndParseConfig();
  const { schema } = await getMesh(meshConfig);

  const server = new ApolloServer({
    schema,
    plugins: [...plugins, ApolloServerPluginLandingPageLocalDefault()],
    introspection: true,
  });
  await server.start();

  app.use(
    "/graphql",
    cors({ credentials: true }),
    express.json({ limit: "50mb" }),
    guard(jwtTokenValidation),
    guard(jwtTokenUserIdentification),
    guard(tenantIdentification()),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const { logInfo, logDebug, logError } = initializeDbLogging(
          { requestId: v4() },
          req?.body?.operationName
        );
        return {
          tenant: req?.tenant,
          externalUser: req?.externalUser,
          baseApiUrl: process.env.BASE_API_URL.replace(/['"]+/g, ""),
          logger: { logInfo, logDebug, logError },
          elastic,
          dataSources: getDataSources({ cache: server.cache }),
        };
      },
    })
  );

  // Express error handler (replaces the Koa error-handling middleware).
  app.use(errorHandlingMiddleware());

  app.listen(port, () => {
    console.log(`🚀 GQL-Mesh is ready on port ${port}!`);
  });
}
main().catch((err) => console.error(err));
