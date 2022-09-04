import { gql } from '@apollo/client'

export const SCHEDULE_QUERY = gql`
  query schedule($name: String!, $isNew: Boolean!) {
    schedule(name: $name)  @skip(if: $isNew) {
      name
      enabled
      cronString
      fromDate
      toDate
      workflowName
      workflowVersion
      workflowContext
      parallelRuns
    }
  }
`
