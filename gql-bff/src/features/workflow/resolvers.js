const { saveSnapshot } = require("./dataSources/workflowEs");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);
const { ForbiddenError } = require("apollo-server-koa");
const {
  userCanSeeResource,
  getTenantIdFromDescription,
  userCanEditResource,
  filterResourcesByTenant,
  getImportData,
  getTenantImportData,
  getWorkflowDescription,
  updateHandlerCondition,
} = require("../common/functions");

const workflowResolvers = {
  Query: {
    getWorkflow: async (_parent, { name, version }, context, _info) => {
      const { dataSources, tenant } = context;

      const workflow = await dataSources.workflowApi.getWorkflow(name, version);
      if (!isMultiTenant) return workflow;

      const wfTenantId = getTenantIdFromDescription(workflow?.description);
      if (userCanSeeResource(wfTenantId, tenant?.id)) {
        return workflow;
      } else
        return new ForbiddenError(
          "You are not authorized to see this workflow."
        );
    },

    getWorkflowList: async (_parent, _args, context, _info) => {
      const { dataSources, tenant } = context;
      const allWorkflows = await dataSources.workflowApi.getWorkflowList();
      if (!isMultiTenant) return allWorkflows;
      else return filterResourcesByTenant(allWorkflows, tenant?.id);
    },

    exportWorkflows: async (_parent, { workflowList }, context, _info) => {
      const { dataSources, tenant } = context;
      const { code } = tenant ?? { code: "" };

      const conductorHandlers =
        await dataSources.eventHandlerApi.getEventHandlerList();
      const handlers = [];
      const flows = [];

      if (workflowList.length === 0) {
        const allWorkflows = await dataSources.workflowApi.getWorkflowList();
        if (isMultiTenant) {
          const tenantFlows = filterResourcesByTenant(allWorkflows, tenant?.id);
          for (const flow of tenantFlows) {
            flows.push(flow);

            const regex = /\\"asyncHandler\\":\\"([a-zA-Z_]*)\\"/g;
            const str = JSON.stringify(flow);
            const h = [...str.matchAll(regex)].map((a) => a[1]);
            handlers.push(
              ...conductorHandlers.filter((a) => h.includes(a.name))
            );
            handlers.push(
              ...conductorHandlers.filter((a) =>
                a.actions.some(
                  (x) =>
                    x.action === "start_workflow" &&
                    x?.start_workflow?.name === flow.name
                )
              )
            );
          }
        } else {
          for (const flow of allWorkflows) {
            flows.push(flow);

            const regex = /\\"asyncHandler\\":\\"([a-zA-Z_]*)\\"/g;
            const str = JSON.stringify(flow);
            const h = [...str.matchAll(regex)].map((a) => a[1]);
            handlers.push(
              ...conductorHandlers.filter((a) => h.includes(a.name))
            );
            handlers.push(
              ...conductorHandlers.filter((a) =>
                a.actions.some(
                  (x) =>
                    x.action === "start_workflow" &&
                    x?.start_workflow?.name === flow.name
                )
              )
            );
          }
        }
      } else {
        for (const flow of workflowList) {
          const name = flow.split("/");
          const conductorFlow = await dataSources.workflowApi.getWorkflow(
            name[0],
            name[1]
          );
          flows.push(conductorFlow);

          const regex = /\\"asyncHandler\\":\\"([a-zA-Z_]*)\\"/g;
          const str = JSON.stringify(conductorFlow);
          const h = [...str.matchAll(regex)].map((a) => a[1]);
          handlers.push(...conductorHandlers.filter((a) => h.includes(a.name)));
          handlers.push(
            ...conductorHandlers.filter((a) =>
              a.actions.some(
                (x) =>
                  x.action === "start_workflow" &&
                  x?.start_workflow?.name === name[0]
              )
            )
          );
        }
      }

      return {
        data: JSON.stringify({ flows, handlers }),
        tenantCode: code.toUpperCase(),
      };
    },
  },

  WorkflowDef: {
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
    importWorkflows: async (_parent, { input, replacements }, context) => {
      const { dataSources, externalUser, tenant } = context;

      var data = null;
      if (isMultiTenant) {
        data = getTenantImportData(input, replacements, tenant);
      } else {
        data = getImportData(input, replacements);
      }

      for (const flow of data.flows) {
        await dataSources.workflowApi.createOrUpdateWorkflow(
          JSON.stringify([
            {
              ...flow,
              description: getWorkflowDescription(
                flow,
                externalUser?.tenantId,
                isMultiTenant
              ),
            },
          ])
        );

        const result = await await dataSources.workflowApi.getWorkflow(
          flow?.name,
          flow?.version
        );

        saveSnapshot(result);
      }

      const conductorHandlers =
        await dataSources.eventHandlerApi.getEventHandlerList();
      for (const handler of data.handlers) {
        const updatedHandler = {
          ...handler,
          condition: updateHandlerCondition(
            handler?.condition,
            isMultiTenant,
            tenant?.id
          ),
        };

        if (conductorHandlers.find((a) => a.name === handler.name)) {
          await dataSources.eventHandlerApi.editEventHandler(
            JSON.stringify(updatedHandler)
          );
        } else {
          await dataSources.eventHandlerApi.createEventHandler(
            JSON.stringify(updatedHandler)
          );
        }
      }
      return "";
    },
    createOrUpdateWorkflow: async (_parent, { input }, context) => {
      const { dataSources, externalUser } = context;
      const body = {
        ...input,
        description: JSON.stringify({
          description: input?.description,
          tenantId: externalUser?.tenantId,
        }),
      };

      //Create or Update workflow in Conductor
      await dataSources.workflowApi.createOrUpdateWorkflow(
        JSON.stringify([body])
      );

      //Create or Update History Snapshot in Elastic
      const result = await await dataSources.workflowApi.getWorkflow(
        input?.name,
        input?.version
      );
      saveSnapshot(result);
    },
  },
};

module.exports = workflowResolvers;
