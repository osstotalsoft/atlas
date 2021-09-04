import { gql } from '@apollo/client'

export const WORKFLOW_LIST_QUERY = gql`
  query getWorkflowList($limit: Int!) {
    getAll(limit: $limit) {
      name
      version
      description
      ownerEmail
      timeoutSeconds
      createdBy
      updatedBy
    }
  }
`
