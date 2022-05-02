import { gql } from '@apollo/client'

export const ADD_EVENT_HANDLER_MUTATION = gql`
  mutation addEventHandler($eventHandlerInput: EventHandlerInput!) {
    createEventHandler(eventHandlerInput: $eventHandlerInput)
  }
`
