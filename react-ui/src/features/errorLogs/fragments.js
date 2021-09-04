import { gql } from '@apollo/client'

const Fragments = {
  log: gql`
    fragment log on Log {
      id
      requestId
      code
      message
      details
      timeStamp
    }
  `
}

export default Fragments
