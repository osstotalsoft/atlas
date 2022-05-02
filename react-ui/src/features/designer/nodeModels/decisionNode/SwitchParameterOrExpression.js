import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import { over } from '@totalsoft/rules-algebra-react'
import { dissoc } from 'ramda'

const SwitchParameterOrExpression = ({ toggle, setToggle, inputsLens }) => {
  const handleToggleChange = useCallback(
    value => {
      setToggle(value)
      if (value) {
        over(inputsLens, dissoc('caseValueParam'))
      } else {
        over(inputsLens, dissoc('caseExpression'))
      }
    },
    [inputsLens, setToggle]
  )

  return <SwitchWithInternalState checked={toggle} onChange={handleToggleChange} />
}

SwitchParameterOrExpression.propTypes = {
  inputsLens: PropTypes.object.isRequired,
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired
}

export default SwitchParameterOrExpression
