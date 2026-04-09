const removeQuotes = (string) => {
  return string.replace(/['"]+/g, "");
};

const introspectionRoute = (ctx) => {
  if (
    (process.env.NODE_ENV === "development" &&
      ctx.method === "GET" &&
      ctx.path === "/graphql") ||
    ctx.request.body.operationName === "IntrospectionQuery" ||
    (ctx.request.body.query &&
      ctx.request.body.query.includes("IntrospectionQuery"))
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = { removeQuotes, introspectionRoute };
