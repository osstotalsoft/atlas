import { gql } from '@apollo/client'

export const EVENT_HANDLERS_QUERY = gql`
  query getEventHandlersForSink($activeOnly: Boolean, $event: String!, $limit: Int, $isNew: Boolean!) {
    getEventHandlersForSink(activeOnly: $activeOnly, event: $event, limit: $limit) @skip(if: $isNew) {
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
