import { gql } from '@apollo/client'
import Fragments from '../../common/fragments'

export const WORKFLOW_QUERY = gql`
  query getWorkflow($name: String!, $skip: Boolean!) {
    getWorkflow(name: $name) @skip(if: $skip) {
      name
      description
      version
      createdBy
      updatedBy
      ownerEmail
      timeoutSeconds
      failureWorkflow
      workflowStatusListenerEnabled
      tasks {
        ...workflowTask
        forkTasks {
          ...workflowTask
        }
      }
    }
  }
  ${Fragments.workflowTask}
`
