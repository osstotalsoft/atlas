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

const toRoleArray = (role) => (Array.isArray(role) ? role : role ? [role] : []);

const jwtTokenValidation = (req, res, next) => {
  validateJwt(req, res, (err) => {
    if (err) return next(err);

    // express-jwt exposes the *verified* payload on req.auth. Authorization must
    // read that, never a decode of the raw header, which is unauthenticated
    // attacker input. Missing claims fail closed.
    const allowedRoles = Object.values(identityUserRoles);
    const userRoles = toRoleArray(req.auth?.role);

    if (!userRoles.some((role) => allowedRoles.includes(role))) {
      return res.status(401).json({ error: "Unauthorized: insufficient role" });
    }

    next();
  });
};

const jwtTokenUserIdentification = (req, _res, next) => {
  const claims = req.auth;

  req.token = req.headers.authorization || "";
  req.externalUser = claims
    ? { id: claims.sub, role: claims.role, tenantId: claims.tid }
    : {};

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
