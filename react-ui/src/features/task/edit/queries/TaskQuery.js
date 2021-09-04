import { gql } from '@apollo/client'

export const TASK_QUERY = gql`
  query getTaskDef($name: String!, $isNew: Boolean!, $limit: Int!) {
    getTaskDef(tasktype: $name) @skip(if: $isNew) {
      name
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
