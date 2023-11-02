import { gql } from '@apollo/client'

export const TASK_QUERY = gql`
  query getTaskDef($name: String!) {
    getTaskDefinition(tasktype: $name) {
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
      inputKeys
      outputKeys
      inputTemplate
    }
  }
`
