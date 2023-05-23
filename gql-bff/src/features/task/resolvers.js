const { ForbiddenError } = require("apollo-server-koa");
const {
  userCanSeeResource,
  getTenantIdFromDescription,
  userCanEditResource,
  filterResourcesByTenant,
} = require("../common/functions");

const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);

const taskResolvers = {
  Query: {
    getTaskDefinition: async (_parent, { tasktype }, context, _info) => {
      const { dataSources, tenant } = context;

      const task = await dataSources.taskApi.getTask(tasktype);
      if (!isMultiTenant) return task;

      const taskTenantId = getTenantIdFromDescription(task?.description);
      if (userCanSeeResource(taskTenantId, tenant?.id)) {
        return task;
      } else
        return new ForbiddenError("You are not authorized to see this task.");
    },
    getTaskDefinitionList: async (_parent, _args, context, _info) => {
      const { dataSources, tenant } = context;
      const allTasks = await dataSources.taskApi.getTaskList();
      if (!isMultiTenant) return allTasks;
      else return filterResourcesByTenant(allTasks, tenant?.id);
    },
  },
  TaskDef: {
    readOnly: (parent, _args, context, _info) => {
      if (!isMultiTenant) return false;

      const { externalUser } = context;
      const wfTenantId = getTenantIdFromDescription(parent?.description);

      return !userCanEditResource(wfTenantId, externalUser);
    },
    description: (parent, _args, _info) => {
      try {
        return JSON.parse(parent?.description)?.description;
      } catch {
        return parent?.description;
      }
    },
  },

  Mutation: {
    createTask: async (_parent, { taskDefsInput }, context) => {
      const { dataSources, externalUser } = context;

      const bodyInputs = taskDefsInput?.map((t) => {
        return {
          ...t,
          description: JSON.stringify({
            description: t?.description,
            tenantId: externalUser?.tenantId,
          }),
        };
      });

      //Create or Update Task definition
      return await dataSources.taskApi.createTaskDefs(bodyInputs);
    },
  },
};

module.exports = taskResolvers;
