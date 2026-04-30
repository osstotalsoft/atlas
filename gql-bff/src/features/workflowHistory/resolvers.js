const { getWorkflowHistory } = require("./datasources/workflowHistoryEs");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);
const { filterResourcesByTenant } = require("../common/functions");

const getInputData = (inputData) => ({
  Payload: inputData.Payload,
  sink: inputData.sink,
});

const getOutputData = (outputData, handlers) => {
  const handler = handlers?.find(
    (h) => h.event === outputData?.["conductor.event.name"],
  );

  const completeTaskAction = handler?.actions?.find(
    (a) => a.action === "COMPLETE_TASK",
  );
  const handlerOutput = completeTaskAction?.completeTask?.output
    ? Object.fromEntries(
        Object.entries(completeTaskAction.completeTask.output).filter(
          ([, v]) => !String(v).includes("Headers"),
        ),
      )
    : {};

  const conditionPayload = {};
  if (handler?.condition) {
    const regex = /Payload\.(\w+)\s*===?\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(handler.condition)) !== null) {
      conditionPayload[match[1]] = match[2];
    }
  }

  return {
    Payload: {
      ...outputData,
      ...handlerOutput,
      ...conditionPayload,
      taskRefName: undefined,
      workflowId: undefined,
      "conductor.event.messageId": undefined,
    },
    sink: outputData?.["conductor.event.name"],
    condition: handler?.condition,
  };
};

const workflowHistoryResolvers = {
  Query: {
    workflowHistory: async (
      _parent,
      { workflowName, version },
      _context,
      _info,
    ) => {
      return await getWorkflowHistory(workflowName, version);
    },

    allWorkflowHistory: async (_parent, _args, context, _info) => {
      const { dataSources, tenant } = context;
      const allWorkflows = await dataSources.workflowApi.getWorkflowList();
      const flows = isMultiTenant
        ? filterResourcesByTenant(allWorkflows, tenant?.id)
        : allWorkflows;

      const history = {};
      for (const flow of flows) {
        const flowHistory = await getWorkflowHistory(flow.name, flow.version);

        if (flowHistory.length <= 1) continue;
        const latest = flowHistory.sort((a, b) =>
          a.timeStamp > b.timeStamp ? -1 : 1,
        )[1];
        if (
          JSON.stringify({
            ...latest.definition,
            updateTime: undefined,
            createTime: undefined,
          }) ===
          JSON.stringify({
            ...flow,
            updateTime: undefined,
            createTime: undefined,
          })
        )
          continue;

        history[`${flow.name}_${flow.version}`] = {
          current: flow,
          latest: flowHistory.sort((a, b) =>
            a.timeStamp > b.timeStamp ? -1 : 1,
          )[1],
        };
      }
      return history;
    },
    allExecutionHistory: async (_parent, _args, context, _info) => {
      const { dataSources, tenant } = context;
      const allWorkflows = await dataSources.workflowApi.getWorkflowList();
      const flows = isMultiTenant
        ? filterResourcesByTenant(allWorkflows, tenant?.id)
        : allWorkflows;

      const handlers =
        await dataSources?.eventHandlerApi?.getEventHandlerList();

      const history = {};
      await Promise.all(
        flows.map(async (flow) => {
          const flowHistory = await dataSources?.executionApi?.getExecutionList(
            {
              size: 1,
              sort: "startTime:DESC",
              start: 0,
              freeText: `(workflowType: ${flow.name} AND version: ${flow.version})`,
              query: `startTime > ${new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).getTime()}`,
            },
          );

          const totalHits = flowHistory.totalHits;
          let executableData = {};

          history[`${flow.name}/${flow.version}`] = {
            totalHits,
            executableData: {},
          };
          if (totalHits > 0) {
            // const instance = completed?.results?.find(
            //   (e) =>
            //     e.status === "COMPLETED" &&
            //     e.workflowType === flow.name &&
            //     e.version === flow.version,
            // );
            for (const instance of flowHistory.results) {
              const execution = await dataSources?.executionApi?.getExecution(
                instance.workflowId,
              );

              executableData = Object.fromEntries(
                (execution?.tasks ?? [])
                  .filter(
                    (t) =>
                      t.taskType === "EVENT" &&
                      t.workflowTask?.asyncComplete === true,
                  )
                  .map((t) => [
                    t.referenceTaskName,
                    {
                      input: getInputData(t.inputData),
                      output: getOutputData(t.outputData, handlers),
                    },
                  ]),
              );

              executableData["input"] = execution.input;
            }
            // console.log(
            //   "Executable Data for",
            //   flow.name,
            //   flow.version,
            //   executableData,
            // );
            history[`${flow.name}/${flow.version}`] = {
              totalHits,
              executableData,
            };
          } 
        }),
      );

      return history;
    },
  },
  WorkflowHistory: {
    definition: (parent, _args, _context, _info) => {
      return { ...parent?.definition, historyId: parent?.snapshotNumber };
    },
  },
};

module.exports = workflowHistoryResolvers;
