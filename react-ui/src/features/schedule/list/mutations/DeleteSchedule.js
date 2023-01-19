import { gql } from '@apollo/client'

export const DELETE_SCHEDULE_MUTATION = gql`
  mutation deleteSchedule($name: String!) {
    removeSchedule(name: $name)
  }
`
