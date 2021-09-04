const { map } = require("ramda");

const generateEventHandlerModel = ({
  name,
  active,
  event,
  condition,
  actions,
}) => ({
  name,
  active,
  event,
  condition,
  actions:
    actions &&
    map(
      ({
        action,
        expandInlineJSON,
        complete_task,
        fail_task,
        start_workflow,
      }) => ({
        action,
        expandInlineJSON,
        completeTask: complete_task && {
          workflowId: complete_task.workflowId,
          taskRefName: complete_task.taskRefName,
          output: complete_task.output,
        },
        failTask: fail_task && {
          workflowId: fail_task.workflowId,
          taskRefName: fail_task.taskRefName,
          output: fail_task.output,
        },
        startWorkflow2: start_workflow && {
          name: start_workflow.name,
          version: start_workflow.version,
          input: start_workflow.input,
        },
      }),
      actions
    ),
});

module.exports = { generateEventHandlerModel };
