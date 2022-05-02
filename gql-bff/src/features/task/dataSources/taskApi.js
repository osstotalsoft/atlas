const ConductorApi = require("../../../utils/conductorApi");

class TaskApi extends ConductorApi {
  async createTaskDefs(body) {
    return await this.post(`/api/metadata/taskdefs`, body, {
      headers: { "content-type": "application/json" },
    });
  }

  async getTask(tasktype) {
    return await this.get(`/api/metadata/taskdefs/${tasktype}`);
  }

  async getTaskList() {
    return await this.get(`/api/metadata/taskdefs`);
  }
}

module.exports = TaskApi;
