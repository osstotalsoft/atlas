import { gql } from '@apollo/client'

export const EXECUTION_LIST_QUERY = gql`
  query getExecutions($size: Int, $start: Int, $freeText: String, $query: String, $sort: String) {
    getExecutionList(size: $size, start: $start, freeText: $freeText, query: $query, sort: $sort) {
      results {
        workflowId
        workflowType
        version
        status
        startTime
        endTime
        executionTime
      }
      totalHits
    }
  }
`
