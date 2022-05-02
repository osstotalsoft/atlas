import { gql } from '@apollo/client'

export const EVENT_HANDLERS_QUERY = gql`
  query getEventHandlersForSink($name: String!, $activeOnly: Boolean, $event: String!, $isNew: Boolean!) {
    eventHandler(name: $name, activeOnly: $activeOnly, event: $event) @skip(if: $isNew) {
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
