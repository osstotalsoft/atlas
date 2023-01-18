const { ForbiddenError } = require("apollo-server-koa");
const { userCanSeeResource } = require("../common/functions");
const {
  updateHandlerCondition,
  getTenantIdFromHandler,
  filterEvHandlersByTenant,
} = require("./functions");
const isMultitenant = JSON.parse(process.env.IS_MULTITENANT);

const eventHandlerResolvers = {
  Query: {
    eventHandler: async (_parent, args, context, _info) => {
      const { dataSources, tenant } = context;
      const response = await dataSources?.eventHandlerApi?.getEventHandler(
        args
      );

      if (!isMultitenant) return response;

      const evHandTenantId = getTenantIdFromHandler(response?.condition);
      if (userCanSeeResource(evHandTenantId, tenant?.id)) {
        return response;
      } else
        return new ForbiddenError(
          "You are not authorized to see this event handler."
        );
    },
    eventHandlerList: async (_parent, _args, context, _info) => {
      const { dataSources, tenant } = context;

      const allEventHandlers =
        await dataSources?.eventHandlerApi?.getEventHandlerList();

      if (!isMultitenant) return allEventHandlers;
      else return filterEvHandlersByTenant(allEventHandlers, tenant?.id);
    },
  },
  EventHandler: {
    condition: (parent, _args, _context, _info) => {
      const longRegex = /\$\.Headers\['nbb-tenantId'\] === '[\w-]+' &&/g;
      const shortRegex = /\$\.Headers\['nbb-tenantId'\] === '[\w-]+'/g;

      const cond = parent?.condition?.replace(longRegex, "");
      return cond?.replace(shortRegex, "");
    },
    actions: (parent, _args, _context, _info) => {
      return parent?.actions?.map((action) => ({
        ...action,
        completeTask: action?.complete_task && {
          workflowId: action?.complete_task?.workflowId,
          taskRefName: action.complete_task?.taskRefName,
          output: action?.complete_task.output,
        },
        failTask: action?.fail_task && {
          workflowId: action?.fail_task?.workflowId,
          taskRefName: action?.fail_task?.taskRefName,
          output: action?.fail_task?.output,
        },
        startWorkflow: action?.start_workflow && {
          name: action?.start_workflow?.name,
          version: action?.start_workflow?.version,
          input: action?.start_workflow?.input,
        },
      }));
    },
  },
  Mutation: {
    createEventHandler: async (_parent, { eventHandlerInput }, context) => {
      const { dataSources, tenant } = context;

      const body = {
        ...eventHandlerInput,
        actions: eventHandlerInput.actions.map((a) => {
          return {
            ...a,
            start_workflow: a.startWorkflow3,
            complete_task: a.completeTask,
            fail_task: a.failTask,
          };
        }),
        condition: updateHandlerCondition(
          eventHandlerInput?.condition,
          isMultitenant,
          tenant?.id
        ),
      };

      //Create Event Handler in Conductor
      await dataSources.eventHandlerApi.createEventHandler(body);
    },

    editEventHandler: async (_parent, { eventHandlerInput }, context) => {
      const { dataSources, tenant } = context;

      const body = {
        ...eventHandlerInput,
        actions: eventHandlerInput.actions.map((a) => {
          return {
            ...a,
            start_workflow: a.startWorkflow3,
            complete_task: a.completeTask,
            fail_task: a.failTask,
          };
        }),
        condition: updateHandlerCondition(
          eventHandlerInput?.condition,
          isMultitenant,
          tenant?.id
        ),
      };
      //Update Event Handler in Conductor
      await dataSources.eventHandlerApi.editEventHandler(body);
    },
  },
};

module.exports = eventHandlerResolvers;
