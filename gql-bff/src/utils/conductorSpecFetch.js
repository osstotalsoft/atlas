// Custom fetch for the Conductor OpenAPI source (see .meshrc.yaml -> customFetch).
//
// The upstream Conductor spec exposes operations whose operationId collides with
// the custom, tenant-aware fields we declare in src/features/execution/schema.graphql:
//   - GET  /api/agent/execution/{executionId}      operationId: getExecution
//   - POST /api/workflow/execute/{name}/{version}  operationId: executeWorkflow
// Mesh derives GraphQL field names from operationId, so those auto-generated fields
// clash with our own Query.getExecution / Mutation.executeWorkflow when the schemas
// are stitched, breaking boot with "Field ... already exists in the schema".
//
// We only ever call Conductor for those two through the ExecutionApi REST data source
// (src/features/execution/dataSources/executionApi.js), never through the generated
// mesh fields, so it is safe to rename the upstream operations out of the way. This
// keeps the spec fetched live from Conductor on every boot; only the two colliding
// operationIds are rewritten. Every other request (spec or runtime) passes through
// untouched.

// Rename map: upstream operationId -> collision-free operationId.
const RENAMES = {
  getExecution: "getAgentExecution",
  executeWorkflow: "executeWorkflowByNameAndVersion",
};

function isApiDocs(url) {
  return typeof url === "string" && url.includes("/api-docs");
}

function patchSpec(specText) {
  const spec = JSON.parse(specText);
  const paths = spec && spec.paths;
  if (paths) {
    for (const pathItem of Object.values(paths)) {
      if (!pathItem || typeof pathItem !== "object") continue;
      for (const operation of Object.values(pathItem)) {
        if (
          operation &&
          typeof operation === "object" &&
          Object.prototype.hasOwnProperty.call(RENAMES, operation.operationId)
        ) {
          operation.operationId = RENAMES[operation.operationId];
        }
      }
    }
  }
  return JSON.stringify(spec);
}

module.exports = async function conductorSpecFetch(url, options) {
  const response = await fetch(url, options);

  if (!isApiDocs(url)) {
    return response;
  }

  try {
    const specText = await response.text();
    const patched = patchSpec(specText);
    return new Response(patched, {
      status: response.status,
      statusText: response.statusText,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    // If anything about the spec is unexpected, fail open with the original body
    // rather than blocking boot.
    console.warn(
      `conductorSpecFetch: could not patch Conductor spec, using it as-is (${err.message})`
    );
    return fetch(url, options);
  }
};
