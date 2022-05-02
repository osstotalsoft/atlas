const ConductorApi = require("../../../utils/conductorApi");

class ExecutionApi extends ConductorApi {
  async getExecution(workflowId) {
    return await this.get(`/api/workflow/${workflowId}`);
  }

  async getExecutionList(args) {
    return await this.get("/api/workflow/search", args);
  }

  async executeWorkflow(body) {
    return await this.post("/api/workflow", body, {
      headers: { "content-type": "application/json" },
    });
  }
}

module.exports = ExecutionApi;
