import { gql } from '@apollo/client'

export const DELETE_EVENT_HANDLER_MUTATION = gql`
  mutation deleteHandler($name: String!) {
    removeEventHandlerStatus(name: $name)
  }
`
