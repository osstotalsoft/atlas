const removeQuotes = (string) => {
  return string.replace(/['"]+/g, "");
};

const introspectionRoute = (ctx) => {
  if (
    ctx.method === "GET" ||
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
