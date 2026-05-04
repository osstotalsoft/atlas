import permissions from 'constants/permissions'
import { gql } from '@apollo/client'
import { useQueryWithErrorHandling } from './errorHandling'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { includes } from 'ramda'
import { useNavigate } from 'react-router-dom'

const { viewSettings } = permissions
const GET_USER_DATA = gql`
  query userData($externalId: ID!) {
    userData(externalId: $externalId) {
      id
      userName
      rights
    }
  }
`

export function useUserData() {
  const { oidcUser } = useReactOidc()
  const externalUserId = oidcUser?.profile?.sub
  const navigate = useNavigate()

  const { data, ...res } = useQueryWithErrorHandling(GET_USER_DATA, {
    variables: {
      externalId: externalUserId
    },
    skip: !externalUserId,
    onError: error => {
      if (error?.networkError?.statusCode === 401) {
        navigate('/forbidden')
      }
    }
  })
  return { ...res, userData: data?.userData, isAdmin: data?.userData?.rights?.includes('admin') }
}

export const useRights = () => {
  const { oidcUser } = useReactOidc()
  const externalUserId = oidcUser?.profile?.sub

  const { data } = useQueryWithErrorHandling(GET_USER_DATA, {
    variables: {
      externalId: externalUserId
    },
    skip: !externalUserId
  })
  const rights = data?.userData?.rights

  return rights
    ? {
        canViewSettings: includes(viewSettings, rights)
      }
    : {}
}
