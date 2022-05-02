import { gql } from '@apollo/client'
import Fragments from 'features/workflow/common/fragments'
import HistoryFragments from '../fragments'

export const WORKFLOW_HISTORY_QUERY = gql`
  query workflowHistory($workflowName: String!, $version: Int!) {
    workflowHistory(workflowName: $workflowName, version: $version) {
      values {
        ...workflowHistory
        definition {
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
    }
  }
  ${HistoryFragments.workflowHistory}
  ${Fragments.partialWorkflowDef}
  ${Fragments.workflowTask}
`
