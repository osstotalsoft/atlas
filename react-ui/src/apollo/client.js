import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { setContext } from '@apollo/client/link/context'
import { env } from '../utils/env'
import { createUploadLink } from 'apollo-upload-client'
import omitDeep from 'omit-deep-lodash'
import { getUserManager } from '@axa-fr/react-oidc-core'
import { emptyObject } from 'utils/constants'

const httpLink = createUploadLink({
  uri: `${env.REACT_APP_GQL_HTTP_PROTOCOL}://${env.REACT_APP_GQL}/graphql`,
  onError: onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })
})

const authLink = setContext(async (_, { headers }) => {
  const userManager = getUserManager()
  const { access_token } = (await userManager.getUser()) ?? emptyObject

  return {
    headers: {
      ...headers,
      authorization: access_token ? `Bearer ${access_token}` : ''
    }
  }
})

const omitTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = omitDeep(operation.variables, ['__typename'])
  }
  return forward(operation)
})

const retryLink = new RetryLink({
  delay: {
    initial: 200,
    max: 2000,
    jitter: true
  },
  attempts: {
    max: 3
  }
})

const myAppLink = () => ApolloLink.from([omitTypenameLink, retryLink, authLink.concat(httpLink)])

const cache = new InMemoryCache({
  typePolicies: {
    Page: {
      keyFields: ['afterId', 'sortBy', 'direction', 'pageSize']
    },
    Query: {
      fields: {
        getWorkflowList: {
          merge(_existing = [], incoming) {
            return incoming
          }
        },
        getExecutionList: {
          merge(_existing = [], incoming) {
            return incoming
          }
        }
      }
    },
    Workflow: {
      keyFields: ['workflowId']
    },
    WorkflowSummary: {
      keyFields: ['workflowId']
    },
    ExternalTenant: { keyFields: ['externalId'] },
    EventHandler: { keyFields: ['name'] },
    WorkflowDef: { keyFields: ['name', 'version', 'historyId'] },
    TaskDef: { keyFields: ['name'] }
  }
})

let apolloClient
export const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = new ApolloClient({
      link: myAppLink(),
      cache
    })
  }
  return apolloClient
}
