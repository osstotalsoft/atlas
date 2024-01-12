import { gql } from '@apollo/client'

export const HISTORY_QUERY = gql`
  query allWorkflowHistory {
    allWorkflowHistory 
  }
`

export const EXECUTION_HISTORY_QUERY = gql`
  query allExecutionHistory {
    allExecutionHistory 
  }
`
