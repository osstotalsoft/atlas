import { gql } from '@apollo/client'

export const EVENT_HANDLER_LIST_QUERY = gql`
  query getEventHandlers($limit: Int) {
    eventHandlerList(limit: $limit) {
      name
      active
      event
      condition
      actions {
        action
        completeTask {
          output
          workflowId
          taskRefName
        }
        failTask {
          output
          workflowId
          taskRefName
        }
        startWorkflow {
          name
          version
          input
        }
        expandInlineJSON
      }
    }
  }
`
