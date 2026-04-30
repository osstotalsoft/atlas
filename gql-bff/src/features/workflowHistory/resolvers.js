const { getWorkflowHistory } = require("./datasources/workflowHistoryEs");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);
const { filterResourcesByTenant } = require("../common/functions");

const transformStringToObject = (queryString) => {
  // 1. Clean the string: Remove the outer curly braces {}
  const cleanedString = queryString.slice(1, -1);

  // 2. Split the string into individual key-value pairs using the comma as a delimiter
  const pairs = cleanedString.split(",");

  // 3. Use reduce to build the final object
  const resultObject = pairs.reduce((acc, pair) => {
    // Split each pair into a key and a value using the equals sign
    const [key, value] = pair.split("=");

    // Trim whitespace and assign to the accumulator object
    if (key && value) {
      // Special handling for 'null' to convert string "null" to actual null type
      let finalValue = value === "null" ? null : value;

      acc[key.trim()] = finalValue;
    }
    return acc;
  }, {}); // Initialize an empty object {}

  return resultObject;
};

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
        flows
          .map(async (flow) => {
            const flowHistory =
              await dataSources?.executionApi?.getExecutionList({
                size: 1,
                sort: "startTime:DESC",
                start: 0,
                freeText: `(workflowType: ${flow.name} AND version: ${flow.version})`,
                query: `startTime > ${new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).getTime()}`,
              });

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
                  await Promise.all(
                    (execution?.tasks ?? [])
                      .filter(
                        (t) =>
                          t.taskType === "EVENT" &&
                          t.workflowTask?.asyncComplete === true,
                      )
                      .map(async (t) => {
                        var tasks = { results: [] };
                        if (t.outputData?.["conductor.event.name"]) {
                          tasks =
                            await dataSources?.executionApi?.getTaskExecutionList(
                              {
                                size: 10,
                                sort: "startTime:DESC",
                                start: 0,
                                freeText: `NOT output:*${t.outputData?.["conductor.event.name"].split(":")[1]}*`,
                                query: `workflowType="${flow.name}" AND  status="COMPLETED" AND taskType="EVENT" AND output = "${t.referenceTaskName}"`,
                              },
                            );
                          if (tasks.results.length > 0) {
                            console.log(
                              "Found matching task for",
                              JSON.stringify(tasks.results),
                            );
                          }
                        }

                        return [
                          t.referenceTaskName,
                          {
                            input: getInputData(t.inputData),
                            output: getOutputData(t.outputData, handlers),
                            otherTasks:
                              tasks.results.length > 0
                                ? Object.fromEntries(
                                    tasks.results.map((task) => {
                                      const eventNameMatch =
                                        typeof task.output === "string"
                                          ? task.output.match(
                                              /conductor\.event\.name=([^,}]+)/,
                                            )
                                          : null;
                                      const eventName = eventNameMatch
                                        ? eventNameMatch[1].trim()
                                        : task.referenceTaskName;
                                      return [
                                        eventName,
                                        {
                                          input: {data: task.input},
                                          output: {
                                            flowId: task.workflowId,
                                            ...getOutputData(
                                              transformStringToObject(
                                                task.output,
                                              ),
                                              handlers,
                                            ),
                                          },
                                        },
                                      ];
                                    }),
                                  )
                                : undefined,
                          },
                        ];
                      }),
                  ),
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
