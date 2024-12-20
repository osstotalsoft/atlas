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
const { filterEvHandlersByTenant } = require("../eventHandler/functions");

const workflowResolvers = {
  Query: {
    getWorkflow: async (_parent, { name, version }, context, _info) => {
      const { dataSources, tenant } = context;

      const workflow = await dataSources.workflowApi.getWorkflow(name, version);
      const conductorHandlers =
        await dataSources.eventHandlerApi.getEventHandlerList();
      const startHandlers = conductorHandlers.filter((a) =>
        a.actions.some(
          (x) =>
            x.action === "start_workflow" && x?.start_workflow?.name === name
        )
      );
      if (!isMultiTenant) return { ...workflow, startHandlers };

      const wfTenantId = getTenantIdFromDescription(workflow?.description);
      if (userCanSeeResource(wfTenantId, tenant?.id)) {
        return { ...workflow, startHandlers };
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

    exportWorkflows: async (
      _parent,
      { workflowList, prefix = '', allHandlers },
      context,
      _info
    ) => {
      const { dataSources, tenant } = context;
      const { code } = tenant ?? { code: "" };

      const conductorHandlers =
        await dataSources.eventHandlerApi.getEventHandlerList();
      const handlers = [];
      const flows = [];

      if (workflowList.length === 0) {
        const allWorkflows = await dataSources.workflowApi.getWorkflowList();
        if (isMultiTenant) {
          const tenantPrefix = prefix?.toUpperCase().startsWith(code.toUpperCase()) ? prefix : `${code.toUpperCase()}_${prefix?.toUpperCase()}`;
          const tenantFlows = filterResourcesByTenant(allWorkflows, tenant?.id);
          for (const flow of tenantFlows) {
            if (!flow.name.startsWith(tenantPrefix)){
              continue;
            }
            flows.push(flow);

            const regex = /\\"asyncHandler\\":\\"([a-zA-Z_]*)\\"/g;
            const str = JSON.stringify(flow);
            const h = [...str.matchAll(regex)].map((a) => a[1]);
            handlers.push(
              ...conductorHandlers.filter((a) => h.includes(a.name))
            );
            handlers.push(
              ...conductorHandlers.filter(
                (a) =>
                  a.actions.some(
                    (x) =>
                      x.action === "start_workflow" &&
                      x?.start_workflow?.name === flow.name
                  ) && !handlers.some((h) => h.name === a.name)
              )
            );
          }
        } else {
          for (const flow of allWorkflows) {
            if (!flow.name.startsWith(prefix)) {
              continue;
            }
            flows.push(flow);

            const regex = /\\"asyncHandler\\":\\"([a-zA-Z_]*)\\"/g;
            const str = JSON.stringify(flow);
            const h = [...str.matchAll(regex)].map((a) => a[1]);
            handlers.push(
              ...conductorHandlers.filter((a) => h.includes(a.name))
            );
            handlers.push(
              ...conductorHandlers.filter(
                (a) =>
                  a.actions.some(
                    (x) =>
                      x.action === "start_workflow" &&
                      x?.start_workflow?.name === flow.name
                  ) && !handlers.some((h) => h.name === a.name)
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
            ...conductorHandlers.filter(
              (a) =>
                a.actions.some(
                  (x) =>
                    x.action === "start_workflow" &&
                    x?.start_workflow?.name === name[0]
                ) && !handlers.some((h) => h.name === a.name)
            )
          );
        }
      }

      //Add all handlers
      if (allHandlers) {
        if (isMultiTenant) {
          const tenantPrefix = prefix?.toUpperCase().startsWith(code.toUpperCase()) ? prefix : `${code.toUpperCase()}_${prefix?.toUpperCase()}`;
          const tenantHandlers = filterEvHandlersByTenant(
            conductorHandlers,
            tenant?.id
          );
          const newH = tenantHandlers.filter(
            (a) => !handlers.some((h) => h.name === a.name) && a.name.startsWith(tenantPrefix)
          );
          handlers.push(...newH);
        } else {
          const newH = conductorHandlers.filter(
            (a) => !handlers.some((h) => h.name === a.name) && a.name.startsWith(prefix)
          );
          handlers.push(...newH);
        }
      }
      return {
        data: JSON.stringify({ flows, handlers }),
        tenantCode: code?.toUpperCase(),
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
  WorkflowTask: {
    defaultCase: (parent, _args, context, _info) => {
      return parent.defaultCase ?? [];
    },
  },
  Mutation: {
    importWorkflows: async (_parent, { input, replacements }, context) => {
      const { dataSources, tenant } = context;

      var data = null;
      if (isMultiTenant) {
        data = getTenantImportData(input, replacements, tenant);
      } else {
        data = getImportData(input, replacements);
      }

      for (const flow of data.flows) {
        var initialWorkflow = {};
        try {
          initialWorkflow = await await dataSources.workflowApi.getWorkflow(
            flow?.name,
            flow?.version
          );
        } catch {
          console.log("New workflow!");
        }

        await dataSources.workflowApi.createOrUpdateWorkflow(
          JSON.stringify([
            {
              ...flow,
              description: getWorkflowDescription(
                flow,
                tenant?.id,
                isMultiTenant
              ),
            },
          ])
        );

        const result = await await dataSources.workflowApi.getWorkflow(
          flow?.name,
          flow?.version
        );

        if (
          JSON.stringify({
            ...initialWorkflow,
            updateTime: undefined,
            createTime: undefined,
          }) ==
          JSON.stringify({
            ...result,
            updateTime: undefined,
            createTime: undefined,
          })
        ) {
          console.log(
            "Workflows has no changes and will not be added to history!"
          );
        } else {
          saveSnapshot(result);
        }
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

        const conductor_handler = conductorHandlers.find(
          (a) => a.name === handler.name
        );

        if (conductor_handler) {
          try {
            await dataSources.eventHandlerApi.editEventHandler(
              JSON.stringify(
                conductor_handler.active
                  ? updatedHandler
                  : { ...updatedHandler, active: false }
              )
            );
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            await dataSources.eventHandlerApi.createEventHandler(
              JSON.stringify(updatedHandler)
            );
          } catch (err) {
            console.log(err);
          }
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
