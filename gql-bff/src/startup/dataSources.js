const WorkflowApi = require("../features/workflow/dataSources/workflowApi");
const TaskApi = require("../features/task/dataSources/taskApi");
const ExecutionApi = require("../features/execution/dataSources/executionApi");
const EventHandlerApi = require("../features/eventHandler/dataSources/eventHandlerApi");
const ScheduleApi = require("../features/schedule/dataSources/scheduleApi");

module.exports.getDataSources = () => ({
  workflowApi: new WorkflowApi(),
  taskApi: new TaskApi(),
  executionApi: new ExecutionApi(),
  eventHandlerApi: new EventHandlerApi(),
  scheduleApi: new ScheduleApi()
});
