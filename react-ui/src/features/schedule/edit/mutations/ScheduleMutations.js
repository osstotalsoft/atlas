import { gql } from '@apollo/client'

export const ADD_SCHEDULE_MUTATION = gql`
  mutation createSchedule($scheduleInput: ScheduleInput!) {
    createSchedule(scheduleInput: $scheduleInput)
  }
`

export const UPDATE_SCHEDULE_MUTATION = gql`
  mutation updateSchedule($name: String!, $scheduleInput: ScheduleInput!) {
    updateSchedule(name: $name, scheduleInput: $scheduleInput)
  }
`