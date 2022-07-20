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
    getSchedules: async (_parent, {}, context, _info) => {
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
  },
  Mutation: {
    createSchedule: async (_parent, { input }, context) => {
      const { dataSources, externalUser } = context;

      const bodyInputs = input?.map((t) => {
        return {
          ...t,
          workflowContext: {
            ...t.workflowContext,
            tenantId: isGlobalAdmin(externalUser)
              ? null
              : externalUser?.tenantId,
          },
        };
      });

      return await dataSources.schellarApi.createSchedule(bodyInputs);
    },
    updateSchedule: async (_parent, { name, input }, context) => {
      const { dataSources } = context;

      return await dataSources.schellarApi.updateSchedule(name, input);
    },
    removeSchedule: async (_parent, { name }, context) => {
      const { dataSources } = context;

      return await dataSources.schellarApi.deleteSchedule(name);
    },
  },
};

module.exports = scheduleResolvers;
