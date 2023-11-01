import { gql } from '@apollo/client'

export const TASK_LIST_QUERY = gql`
  query getTaskList {
    getTaskDefinitionList {
      name
      description
      createTime
      inputKeys
      inputTemplate
    }
  }
`
