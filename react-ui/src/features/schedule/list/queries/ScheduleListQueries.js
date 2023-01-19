import { gql } from '@apollo/client'

export const SCHEDULE_LIST_QUERY = gql`
  query scheduleList {
    scheduleList {
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
