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
const { isAnonymousIntrospectionAllowed } = require("./utils/functions");

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

const isDevelopment = process.env.NODE_ENV === "development";

const hasAuthConf = Boolean(
  process.env.IDENTITY_AUTHORITY && process.env.IDENTITY_OPENID_CONFIGURATION
);

// Fail closed: a missing identity configuration must never silently serve the
// whole schema anonymously. Outside development it is a fatal misconfiguration.
if (!hasAuthConf && !isDevelopment) {
  throw new Error(
    "IDENTITY_AUTHORITY and IDENTITY_OPENID_CONFIGURATION are required. " +
      "Refusing to start with authentication disabled."
  );
}
if (!hasAuthConf) {
  console.warn(
    "⚠️  Authentication is DISABLED: no identity configuration found. " +
      "This is only tolerated because NODE_ENV=development."
  );
}

// Only unauthenticated schema introspection in development may skip auth.
const skipAuth = (req) => !hasAuthConf || isAnonymousIntrospectionAllowed(req);

// Comma-separated allowlist, e.g. "https://atlas.example.com". Unset means any
// origin, which is the previous behaviour and stays safe only because CORS
// credentials are off.
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : "*";
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
    plugins: isDevelopment
      ? [...plugins, ApolloServerPluginLandingPageLocalDefault()]
      : plugins,
    introspection: isDevelopment,
  });
  await server.start();

  app.use(
    "/graphql",
    // Credentials travel as a bearer header, so browser credential forwarding is
    // not needed; enabling it alongside a reflected origin would let any site
    // drive authenticated requests. Origins are allowlisted when configured.
    cors({ origin: allowedOrigins, credentials: false }),
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
