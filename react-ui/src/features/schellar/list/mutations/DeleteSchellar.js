import { gql } from '@apollo/client'

export const DELETE_SCHELLAR_MUTATION = gql`
  mutation deleteSchellar($name: String!) {
    removeSchedule(name: $name)
  }
`
