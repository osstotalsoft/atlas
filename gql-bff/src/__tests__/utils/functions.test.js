const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

const loadFunctions = (nodeEnv) => {
  jest.resetModules();
  process.env.NODE_ENV = nodeEnv;
  return require("../../utils/functions");
};

const postRequest = (query, operationName) => ({
  method: "POST",
  originalUrl: "/graphql",
  body: { query, operationName },
});

afterAll(() => {
  process.env.NODE_ENV = ORIGINAL_NODE_ENV;
});

describe("isIntrospectionOnlyDocument", () => {
  const { isIntrospectionOnlyDocument } = loadFunctions("development");

  it.each([
    ["query { __schema { queryType { name } } }"],
    ["query IntrospectionQuery { __schema { types { name } } }"],
    ["{ __type(name: \"Workflow\") { name } }"],
    ["query { __typename }"],
  ])("accepts introspection-only document: %s", (query) => {
    expect(isIntrospectionOnlyDocument(query)).toBe(true);
  });

  it.each([
    // The historical bypass: a name or a substring must never grant access.
    ["mutation IntrospectionQuery { deleteWorkflow(name: \"x\") }"],
    ["mutation { deleteWorkflow(name: \"x\") } # IntrospectionQuery"],
    ["query IntrospectionQuery { getWorkflowList { workflowId } }"],
    // Data fields smuggled alongside a legitimate introspection field.
    ["query { __schema { types { name } } getWorkflowList { workflowId } }"],
    // Fragments can hide data fields behind an introspection-looking selection.
    ["query { ...F } fragment F on Query { getWorkflowList { workflowId } }"],
    ["{ ... on Query { getWorkflowList { workflowId } } }"],
    ["not a graphql document"],
    [""],
    [undefined],
  ])("rejects non-introspection document: %s", (query) => {
    expect(isIntrospectionOnlyDocument(query)).toBe(false);
  });
});

describe("isAnonymousIntrospectionAllowed", () => {
  it("allows a genuine introspection query in development", () => {
    const { isAnonymousIntrospectionAllowed } = loadFunctions("development");
    const req = postRequest(
      "query IntrospectionQuery { __schema { queryType { name } } }",
      "IntrospectionQuery"
    );

    expect(isAnonymousIntrospectionAllowed(req)).toBe(true);
  });

  it("denies a mutation named IntrospectionQuery in development", () => {
    const { isAnonymousIntrospectionAllowed } = loadFunctions("development");
    const req = postRequest(
      "mutation IntrospectionQuery { deleteWorkflow(name: \"x\") }",
      "IntrospectionQuery"
    );

    expect(isAnonymousIntrospectionAllowed(req)).toBe(false);
  });

  it("denies introspection entirely in production", () => {
    const { isAnonymousIntrospectionAllowed } = loadFunctions("production");
    const req = postRequest(
      "query IntrospectionQuery { __schema { queryType { name } } }",
      "IntrospectionQuery"
    );

    expect(isAnonymousIntrospectionAllowed(req)).toBe(false);
  });

  it("denies the sandbox GET route in production", () => {
    const { isAnonymousIntrospectionAllowed } = loadFunctions("production");

    expect(
      isAnonymousIntrospectionAllowed({ method: "GET", originalUrl: "/graphql" })
    ).toBe(false);
  });

  it("ignores paths that are not the graphql endpoint", () => {
    const { isAnonymousIntrospectionAllowed } = loadFunctions("development");

    expect(
      isAnonymousIntrospectionAllowed({
        method: "POST",
        originalUrl: "/admin",
        body: { query: "query { __schema { queryType { name } } }" },
      })
    ).toBe(false);
  });
});
