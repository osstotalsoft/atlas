const { ForbiddenError } = require("apollo-server-koa");
const {
  userCanSeeResource,
  getTenantIdFromDescription,
  userCanEditResource,
  filterResourcesByTenant,
} = require("../common/functions");

const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);

const scheduleResolvers = {
  Query: {
    scheduleList: async (_parent, {}, context, _info) => {
      const { dataSources, tenantId } = context;

      const schedules = await dataSources.scheduleApi.getSchedules();
      if (!isMultiTenant) return schedules;

      /*const taskTenantId = getTenantIdFromDescription(task?.description);
      if (userCanSeeResource(taskTenantId, tenantId)) {
        return task;
      } else
        return new ForbiddenError("You are not authorized to see this task.");
        */
    },
    schedule: async (_parent, { name }, context, _info) => {
      const { dataSources, tenantId } = context;

      const schedule = await dataSources.scheduleApi.getSchedule(name);
      if (!isMultiTenant) return schedule;
    },
  },
  Mutation: {
    createSchedule: async (_parent, { scheduleInput }, context) => {
      const { dataSources, externalUser } = context;

      const bodyInputs = {
        ...scheduleInput,
        workflowContext: {
          ...scheduleInput?.workflowContext,
          tenantId: externalUser?.tenantId,
        },
      };

      return await dataSources.scheduleApi.createSchedule(bodyInputs);
    },
    updateSchedule: async (_parent, { name, scheduleInput }, context) => {
      const { dataSources } = context;

      await dataSources.scheduleApi.updateSchedule(name, scheduleInput);

      return "";
    },
    removeSchedule: async (_parent, { name }, context) => {
      const { dataSources } = context;

      await dataSources.scheduleApi.deleteSchedule(name);

      return "";
    },
  },
};

module.exports = scheduleResolvers;
