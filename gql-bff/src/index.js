// env
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  const path = `.env`;
  dotenv.config({ path });
}

const Koa = require("koa");
const { ApolloServer } = require("apollo-server-koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");

const { v4 } = require("uuid");

// MultiTenancy
const ignore = require("koa-ignore");
const { introspectionRoute } = require("./utils/functions");

// Logging
const { initializeDbLogging } = require("./plugins/logging/loggingUtils");
const loggingPlugin = require("./plugins/logging/loggingPlugin");
const plugins = [loggingPlugin];

const app = new Koa();
const port = process.env.PORT || 5000;

const {
  jwtTokenValidation,
  errorHandlingMiddleware,
  tenantIdentification,
  jwtTokenUserIdentification,
} = require("./middleware");

app.use(errorHandlingMiddleware());
app.use(bodyParser());
app.use(cors());
app.use(
  ignore(
    jwtTokenValidation,
    jwtTokenUserIdentification,
    tenantIdentification()
  ).if((ctx) => introspectionRoute(ctx))
);

const { elastic } = require("./elasticSearch");
const { getDataSources } = require("./startup/dataSources");

async function main() {
  const { getMesh } = require("@graphql-mesh/runtime");
  const { findAndParseConfig } = require("@graphql-mesh/config");

  const meshConfig = await findAndParseConfig();
  const { schema } = await getMesh(meshConfig);
  const server = new ApolloServer({
    schema,
    plugins,
    playground: true,
    dataSources: getDataSources,
    context: async ({ ctx }) => {
      const { logInfo, logDebug, logError } = initializeDbLogging(
        { requestId: v4() },
        ctx?.request?.body?.operationName
      );
      return {
        tenantId: ctx?.tenantId,
        externalUser: ctx?.externalUser,
        baseApiUrl: process.env.BASE_API_URL.replace(/['"]+/g, ""),
        logger: { logInfo, logDebug, logError },
        elastic,
      };
    },
  });

  app.listen(port, () => {
    console.log(`🚀 GQL-Mesh is ready on port ${port}!`);
  });

  server.applyMiddleware({ app });
}
main().catch((err) => console.error(err));
