import { gql } from '@apollo/client'

export const WORKFLOW_LIST_QUERY = gql`
  query getWorkflowList {
    getWorkflowList {
      name
      version
      description
      ownerEmail
      timeoutSeconds
      createdBy
      updatedBy
      createTime
      updateTime
      historyId
      readOnly
    }
  }
`
