import { gql } from '@apollo/client'

export const ADD_EVENT_HANDLER_MUTATION = gql`
  mutation addEventHandler($eventHandlerInput: EventHandlerInput!) {
    addEventHandler(eventHandlerInput: $eventHandlerInput)
  }
`
