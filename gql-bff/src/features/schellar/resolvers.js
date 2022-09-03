const { ForbiddenError } = require("apollo-server-koa");
const {
  userCanSeeResource,
  getTenantIdFromDescription,
  userCanEditResource,
  filterResourcesByTenant,
  isGlobalAdmin,
} = require("../common/functions");

const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);

const scheduleResolvers = {
  Query: {
    scheduleList: async (_parent, {}, context, _info) => {
      const { dataSources, tenantId } = context;

      const schedules = await dataSources.schellarApi.getSchedules();
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

      const schedule = await dataSources.schellarApi.getSchedule(name);
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
          tenantId: isGlobalAdmin(externalUser) ? null : externalUser?.tenantId,
        },
      };

      return await dataSources.schellarApi.createSchedule(bodyInputs);
    },
    updateSchedule: async (_parent, { name, scheduleInput }, context) => {
      const { dataSources } = context;

      await dataSources.schellarApi.updateSchedule(name, scheduleInput);

      return "";
    },
    removeSchedule: async (_parent, { name }, context) => {
      const { dataSources } = context;

      await dataSources.schellarApi.deleteSchedule(name);

      return "";
    },
  },
};

module.exports = scheduleResolvers;
