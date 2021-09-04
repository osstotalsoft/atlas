import { gql } from '@apollo/client'

export const DELETE_TASK_DEF_MUTATION = gql`
  mutation deleteTaskDef($name: String!) {
    unregisterTaskDef(tasktype: $name)
  }
`
