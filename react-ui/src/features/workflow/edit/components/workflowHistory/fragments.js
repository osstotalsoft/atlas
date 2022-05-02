import { gql } from '@apollo/client'

const Fragments = {
  workflowHistory: gql`
    fragment workflowHistory on WorkflowHistory {
      id
      snapshotNumber
      timeStamp
      createdBy
      changedBy
    }
  `
}

export default Fragments
