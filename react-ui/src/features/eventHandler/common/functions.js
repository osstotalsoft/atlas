import { map } from 'ramda'
import { EVENT_HANDLER_LIST_QUERY } from '../list/queries/EventHandlerListQuery'

export const updateCacheList = (cache, variables, newList) => {
  cache.writeQuery({
    query: EVENT_HANDLER_LIST_QUERY,
    data: {
      eventHandlerList: newList
    },
    variables
  })
}

export const generateModelForSaving = ({ name, active, event, condition, actions }) => ({
  name,
  active,
  event,
  condition,
  actions:
    actions &&
    map(
      ({ action, expandInlineJSON, completeTask, failTask, startWorkflow }) => ({
        action,
        expandInlineJSON,
        completeTask: completeTask && {
          workflowId: completeTask.workflowId,
          taskRefName: completeTask.taskRefName,
          output: completeTask.output
        },
        failTask: failTask && { workflowId: failTask.workflowId, taskRefName: failTask.taskRefName, output: failTask.output },
        startWorkflow3: startWorkflow && { name: startWorkflow.name, version: startWorkflow.version, input: startWorkflow.input }
      }),
      actions
    )
})
