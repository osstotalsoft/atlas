import { gql } from '@apollo/client'

export const EXECUTION_SUMMARY_QUERY = gql`
  query getSummary($size: Int, $start: Int, $freeText: String, $query: String, $sort: String) {
    search1(size: $size, start: $start, freeText: $freeText, query: $query, sort: $sort) {
      results {
        workflowId
        workflowType
        status
        startTime
        endTime
        executionTime
      }
      totalHits
    }
  }
`
