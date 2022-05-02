import { gql } from '@apollo/client'

export const UPDATE_EVENT_HANDLER_MUTATION = gql`
  mutation updateEventHandler($eventHandlerInput: EventHandlerInput!) {
    editEventHandler(eventHandlerInput: $eventHandlerInput)
  }
`
