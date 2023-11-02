import { gql } from '@apollo/client'
import Fragments from '../../common/fragments'

export const WORKFLOW_QUERY = gql`
  query getWorkflow($name: String!, $version: Int!, $skip: Boolean!) {
    getWorkflow(name: $name, version: $version) @skip(if: $skip) {
      ...partialWorkflowDef
      startHandlers {
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
      tasks {
        ...workflowTask
        forkTasks {
          ...workflowTask
        }
        defaultCase {
          ...workflowTask
        }
      }
    }
  }
  ${Fragments.partialWorkflowDef}
  ${Fragments.workflowTask}
`
