import { gql } from '@apollo/client'

export const TIMEOUT_POLICY_OPTIONS = gql`
  query timeoutPolicyListQuery {
    __type(name: "TimeoutPolicy") {
      enumValues {
        name
      }
    }
  }
`
