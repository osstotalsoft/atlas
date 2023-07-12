import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Container } from './CustomRouteStyle'
import { useReactOidc, withOidcSecure } from '@axa-fr/react-oidc-context'
import { emptyArray } from 'utils/constants'
import { isEmpty } from 'ramda'
import { useUserData } from 'hooks/rights'
import { FakeText, Forbidden } from '@totalsoft/rocket-ui'
import { intersect } from 'utils/functions'

function PrivateRoute({ component: Component, roles, rights }) {
  const SecuredComponent = useMemo(() => withOidcSecure(Component), [Component])

  const { oidcUser } = useReactOidc()
  const userRoles = oidcUser?.profile?.role || emptyArray
  const { userData, loading } = useUserData()
  const userRights = userData?.rights || emptyArray

  let allow = false
  if (isEmpty(rights) && isEmpty(roles) && oidcUser) {
    allow = true
  } else {
    allow = isEmpty(rights)
      ? intersect(userRoles, roles) || !oidcUser
      : (intersect(userRights, rights) && intersect(userRoles, roles)) || !oidcUser
  }

  return useMemo(() => {
    if (loading) {
      return <FakeText lines={10} />
    }

    return allow ? <SecuredComponent /> : <Forbidden />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, allow, SecuredComponent])
}

PrivateRoute.defaultProps = {
  roles: emptyArray,
  rights: emptyArray
}

PrivateRoute.propTypes = {
  component: PropTypes.func,
  roles: PropTypes.array,
  rights: PropTypes.array
}

function CustomRoute({ isPrivate, component: Component, ...props }) {
  return <Container {...props}>{isPrivate ? <PrivateRoute component={Component} {...props} /> : <Component />}</Container>
}

CustomRoute.defaultProps = {
  roles: emptyArray,
  rights: emptyArray,
  isPrivate: true,
  fullWidth: false
}

CustomRoute.propTypes = {
  component: PropTypes.func,

  roles: PropTypes.array,
  rights: PropTypes.array,
  isPrivate: PropTypes.bool,
  fullWidth: PropTypes.bool
}

export default CustomRoute
