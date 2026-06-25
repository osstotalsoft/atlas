const removeQuotes = (string) => {
  return string.replace(/['"]+/g, "");
};

const introspectionRoute = (req) => {
  const path = (req.originalUrl || req.path || "").split("?")[0];
  const body = req.body || {};
  if (
    (process.env.NODE_ENV === "development" &&
      req.method === "GET" &&
      path.endsWith("/graphql")) ||
    body.operationName === "IntrospectionQuery" ||
    (body.query && body.query.includes("IntrospectionQuery"))
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = { removeQuotes, introspectionRoute };
