const WorkflowApi = require("../features/workflow/dataSources/workflowApi");
const TaskApi = require("../features/task/dataSources/taskApi");
const ExecutionApi = require("../features/execution/dataSources/executionApi");
const EventHandlerApi = require("../features/eventHandler/dataSources/eventHandlerApi");
const SchellarApi = require("../features/schellar/dataSources/schellarApi");

module.exports.getDataSources = () => ({
  workflowApi: new WorkflowApi(),
  taskApi: new TaskApi(),
  executionApi: new ExecutionApi(),
  eventHandlerApi: new EventHandlerApi(),
  schellarApi: new SchellarApi()
});
