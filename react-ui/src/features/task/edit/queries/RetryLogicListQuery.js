import { gql } from '@apollo/client'

export const RETRY_LOGIC_OPTIONS = gql`
  query retryLogicListQuery {
    __type(name: "RetryLogic") {
      enumValues {
        name
      }
    }
  }
`
