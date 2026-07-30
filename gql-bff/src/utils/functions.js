const { parse } = require("graphql");

const removeQuotes = (string) => {
  return string.replace(/['"]+/g, "");
};

// Meta-fields that expose schema shape only, never application data.
const introspectionFields = ["__schema", "__type", "__typename"];

/**
 * True only when every operation in the document is a query whose top-level
 * selections are all introspection meta-fields.
 *
 * The document is parsed rather than string-matched: the operation name and the
 * query text are attacker-controlled, so they must never be allowed to steer an
 * authentication decision. Fragment spreads and inline fragments are rejected at
 * the top level because they can smuggle in data fields.
 */
const isIntrospectionOnlyDocument = (query) => {
  if (typeof query !== "string" || query.trim() === "") {
    return false;
  }

  let document;
  try {
    document = parse(query);
  } catch {
    return false;
  }

  const operations = document.definitions.filter(
    (definition) => definition.kind === "OperationDefinition"
  );
  if (operations.length === 0) {
    return false;
  }

  return operations.every(
    (operation) =>
      operation.operation === "query" &&
      operation.selectionSet.selections.every(
        (selection) =>
          selection.kind === "Field" &&
          introspectionFields.includes(selection.name.value)
      )
  );
};

/**
 * Anonymous introspection exists so the Apollo sandbox can load the schema while
 * developing locally. It is never permitted outside development.
 */
const isAnonymousIntrospectionAllowed = (req) => {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  const path = (req.originalUrl || req.path || "").split("?")[0];
  if (!path.endsWith("/graphql")) {
    return false;
  }

  // The sandbox is fetched over GET before it posts the introspection document.
  if (req.method === "GET") {
    return true;
  }

  return isIntrospectionOnlyDocument(req.body?.query);
};

module.exports = {
  removeQuotes,
  isIntrospectionOnlyDocument,
  isAnonymousIntrospectionAllowed,
};
