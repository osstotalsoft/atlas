const WorkflowApi = require("../features/workflow/dataSources/workflowApi");
const TaskApi = require("../features/task/dataSources/taskApi");
const ExecutionApi = require("../features/execution/dataSources/executionApi");
const EventHandlerApi = require("../features/eventHandler/dataSources/eventHandlerApi");
const ScheduleApi = require("../features/schedule/dataSources/scheduleApi");

module.exports.getDataSources = (config) => ({
  workflowApi: new WorkflowApi(config),
  taskApi: new TaskApi(config),
  executionApi: new ExecutionApi(config),
  eventHandlerApi: new EventHandlerApi(config),
  scheduleApi: new ScheduleApi(config)
});
