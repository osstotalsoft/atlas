import { gql } from '@apollo/client'

export const EVENT_HANDLER_LIST_QUERY = gql`
  query getEventHandlers($limit: Int) {
    getEventHandlers(limit: $limit) {
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
        startWorkflow2 {
          name
          version
          input
        }
        expandInlineJSON
      }
    }
  }
`
