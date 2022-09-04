const merge = require("lodash.merge");

const workflowResolvers = require("../features/workflow/resolvers");
const taskResolvers = require("../features/task/resolvers");
const workflowHistoryResolvers = require("../features/workflowHistory/resolvers");
const eventHandlerResolvers = require("../features/eventHandler/resolvers");
const logsResolvers = require("../features/logs/resolvers");
const executionResolvers = require("../features/execution/resolvers");
const scheduleResolvers = require("../features/schedule/resolvers");
const featuresResolvers = require("../features/features/resolvers");

const additionalResolvers = merge(
  workflowResolvers,
  workflowHistoryResolvers,
  eventHandlerResolvers,
  logsResolvers,
  executionResolvers,
  taskResolvers,
  scheduleResolvers,
  featuresResolvers
);

module.exports = additionalResolvers;
