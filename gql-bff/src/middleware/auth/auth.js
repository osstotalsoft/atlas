const jwt = require("koa-jwt");
const jwksRsa = require("jwks-rsa");
const jsonwebtoken = require("jsonwebtoken");
const { IDENTITY_AUTHORITY, IDENTITY_OPENID_CONFIGURATION } = process.env;

const client = {
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 2,
  jwksUri: `${IDENTITY_AUTHORITY}${IDENTITY_OPENID_CONFIGURATION}`,
};

const jwtTokenValidation = (ctx, next) => {
  //skip token validation for playground and introspection query
  if (
    ctx.method === "GET" ||
    ctx.request.body.operationName === "IntrospectionQuery" ||
    ctx.request.body.query.includes("IntrospectionQuery")
  ) {
    return next();
  } else {
    const validateJwtToken = jwt({
      secret: jwksRsa.koaJwtSecret(client),
      issuer: IDENTITY_AUTHORITY,
      algorithms: ["RS256"],
    });
    return validateJwtToken(ctx, next);
  }
};

const validateToken = async (token) => {
  const decoded = jsonwebtoken.decode(token, { complete: true });

  const Promise = require("bluebird");
  const getKey = Promise.promisify(jwksRsa(client).getSigningKey);
  const key = await getKey(decoded.header.kid);

  return jsonwebtoken.verify(token, key.getPublicKey());
};

module.exports = { jwtTokenValidation, validateToken };
