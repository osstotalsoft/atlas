import { gql } from '@apollo/client'
import Fragments from '../fragments'

export const ERROR_LOG_QUERY = gql`
  query log($logId: String!) {
    log(logId: $logId) {
      ...log
    }
  }
  ${Fragments.log}
`
