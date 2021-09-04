import { gql } from '@apollo/client'

export const EXECUTION_LIST_QUERY = gql`
  query getExecutions($size: Int, $start: Int, $freeText: String, $sort: String) {
    search1(size: $size, start: $start, freeText: $freeText, sort: $sort) {
      results {
        workflowId
        workflowType
        status
        startTime
        endTime
      }
      totalHits
    }
  }
`
