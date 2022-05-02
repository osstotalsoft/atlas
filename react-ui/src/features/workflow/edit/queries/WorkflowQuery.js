import { gql } from '@apollo/client'
import Fragments from '../../common/fragments'

export const WORKFLOW_QUERY = gql`
  query getWorkflow($name: String!, $version: Int!, $skip: Boolean!) {
    getWorkflow(name: $name, version: $version) @skip(if: $skip) {
      ...partialWorkflowDef
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
