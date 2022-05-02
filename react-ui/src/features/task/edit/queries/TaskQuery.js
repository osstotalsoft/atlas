import { gql } from '@apollo/client'

export const TASK_QUERY = gql`
  query getTaskDef($name: String!, $isNew: Boolean!, $limit: Int!) {
    getTaskDefinition(tasktype: $name) @skip(if: $isNew) {
      name
      readOnly
      createTime
      description
      retryCount
      ownerEmail
      timeoutSeconds
      timeoutPolicy
      retryLogic
      retryDelaySeconds
      responseTimeoutSeconds
      rateLimitPerFrequency
      rateLimitFrequencyInSeconds
    }
    getTaskDefs(limit: $limit) {
      name
    }
  }
`
