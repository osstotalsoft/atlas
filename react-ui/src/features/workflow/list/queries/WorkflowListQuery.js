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

export const WORKFLOW_EXPORT_QUERY = gql`
   query exportWorkflows($workflowList: [String], $prefix: String, $allHandlers: Boolean) {
    exportWorkflows(workflowList: $workflowList, prefix: $prefix, allHandlers: $allHandlers) {
      data
      tenantCode
    }
  }
`
