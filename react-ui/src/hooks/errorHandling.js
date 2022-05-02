import React from 'react'
import PropTypes from 'prop-types'
import { useApolloClient, useQuery } from '@apollo/client'
import { useCallback } from 'react'
import { emptyFunction } from 'utils/constants'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Link } from 'react-router-dom'
import { match } from 'ramda'

export function useQueryWithErrorHandling(query, { onError = emptyFunction, ...props } = {}) {
  const showError = useError()
  const errorHandler = useCallback(
    error => {
      onError()
      showError(error)
    },
    [onError, showError]
  )

  return useQuery(query, {
    ...props,
    onError: errorHandler
  })
}

export function useClientQueryWithErrorHandling() {
  const client = useApolloClient()
  const showError = useError()
  return async (query, props) => {
    try {
      return await client.query({
        query,
        ...props
      })
    } catch (error) {
      showError(error)
      return { loading: false, error }
    }
  }
}

export const useError = () => {
  const addToast = useToast()
  const generateErrorMessage = error => `${error.extensions.code} - ${error.message}`
  const generateSimpleErrorMessage = message => `There is a problem communicating with the server. ${message}`
  const addErrorToast = useCallback(
    message => {
      const logId = match(/Log Id: < (.*) > Request Id:/, message)[1]
      addToast(<LinkedToast logId={logId}>{generateSimpleErrorMessage(message)}</LinkedToast>, 'error', false)
    },
    [addToast]
  )

  const LinkedToast = ({ logId, children }) => {
    return (
      <Link
        style={{
          color: 'white'
        }}
        to={`/logs/${logId}`}
      >
        {children}
      </Link>
    )
  }

  LinkedToast.propTypes = {
    children: PropTypes.node,
    logId: PropTypes.string
  }

  return useCallback(
    error => {
      if (!error?.graphQLErrors && !error?.networkError?.result?.errors) {
        addErrorToast(generateSimpleErrorMessage(error.message))
        return
      }

      const graphQLErrors = error?.graphQLErrors ?? []
      graphQLErrors.forEach(err => {
        err?.extensions?.code ? addErrorToast(generateErrorMessage(err)) : addErrorToast(generateSimpleErrorMessage(err.message))
      })

      const networkErrors = error?.networkError?.result?.errors ?? []
      networkErrors.forEach(err => addErrorToast(generateErrorMessage(err)))
    },
    [addErrorToast]
  )
}
