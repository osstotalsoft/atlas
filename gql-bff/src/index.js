// env
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  const path = `.env`;
  dotenv.config({ path });
}

const Koa = require("koa");
const { ApolloServer } = require("apollo-server");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");

const { v4 } = require("uuid");

// Logging
const { initializeDbLogging } = require("./plugins/logging/loggingUtils");
const loggingPlugin = require("./plugins/logging/loggingPlugin");
const plugins = [loggingPlugin];

const app = new Koa();
const port = process.env.PORT || 5000;

const { jwtTokenValidation, errorHandlingMiddleware } = require("./middleware");

app.use(errorHandlingMiddleware());
app.use(bodyParser());
app.use(cors());
app.use(jwtTokenValidation);

const { elastic } = require("./elasticSearch");

async function main() {
  const { getMesh } = require("@graphql-mesh/runtime");
  const { findAndParseConfig } = require("@graphql-mesh/config");

  const meshConfig = await findAndParseConfig();
  const { schema } = await getMesh(meshConfig);
  const server = new ApolloServer({
    schema,
    plugins,
    playground: true,
    context: async (context) => {
      const { logInfo, logDebug, logError } = initializeDbLogging(
        { requestId: v4() },
        context.req.body.operationName
      );
      return {
        baseApiUrl: process.env.BASE_API_URL.replace(/['"]+/g, ""),
        logger: { logInfo, logDebug, logError },
        elastic,
      };
    },
  });

  server.listen(port, () => {
    console.log(`🚀 GQL-Mesh is ready on port ${port}!`);
  });
}
main().catch((err) => console.error(err));
