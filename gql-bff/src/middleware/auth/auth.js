const { expressjwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const jsonwebtoken = require("jsonwebtoken");
const identityUserRoles = require("../../constants/identityUserRoles");
const { IDENTITY_AUTHORITY, IDENTITY_OPENID_CONFIGURATION } = process.env;

const client = {
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: 600000, // Defaults to 10m
  rateLimit: true,
  jwksRequestsPerMinute: 2,
  jwksUri: `${IDENTITY_AUTHORITY}${IDENTITY_OPENID_CONFIGURATION}`,
  debug: true,
};
const validateJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret(client),
  issuer: IDENTITY_AUTHORITY,
  algorithms: ["RS256"],
});

const jwtTokenValidation = (req, res, next) => {
  validateJwt(req, res, (err) => {
    if (err) return next(err);
    const token = req.headers.authorization || "";
    if (token) {
      const decoded = jsonwebtoken.decode(token.replace("Bearer ", ""));
      const allowedRoles = Object.values(identityUserRoles);
      const userRoles = Array.isArray(decoded?.role)
        ? decoded.role
        : decoded?.role
        ? [decoded.role]
        : [];
      if (!decoded || !userRoles.some((r) => allowedRoles.includes(r))) {
        return res
          .status(401)
          .json({ error: "Unauthorized: insufficient role" });
      }
    }
    next();
  });
};

const jwtTokenUserIdentification = (req, _res, next) => {
  const token = req.headers.authorization || "";
  let externalUser = {};
  if (token) {
    const decoded = jsonwebtoken.decode(token.replace("Bearer ", ""));
    if (decoded) {
      externalUser = {
        id: decoded.sub,
        role: decoded.role,
        tenantId: decoded.tid,
      };
    }
  }

  req.token = token;
  req.externalUser = externalUser;

  next();
};

const validateToken = async (token) => {
  const decoded = jsonwebtoken.decode(token, { complete: true });

  const Promise = require("bluebird");
  const getKey = Promise.promisify(jwksRsa(client).getSigningKey);
  const key = await getKey(decoded.header.kid);

  return jsonwebtoken.verify(token, key.getPublicKey());
};

module.exports = {
  jwtTokenValidation,
  jwtTokenUserIdentification,
  validateToken,
};
