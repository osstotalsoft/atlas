import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FormControlLabel, Switch } from '@material-ui/core'
function SwitchWithInternalState({ checked, onChange, disabled, labelOff, labelOn }) {
  const [state, setState] = useState(checked)

  const handlePropertyChanged = useCallback(
    event => {
      setState(event.target.checked)
      onChange(event.target.checked)
    },
    [onChange]
  )

  useEffect(() => {
    setState(checked)
  }, [checked])

  return (
    <FormControlLabel
      control={<Switch checked={state} onChange={handlePropertyChanged} disabled={disabled} name='isOptional' color='secondary' />}
      label={state ? labelOn : labelOff}
    />
  )
}

SwitchWithInternalState.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  labelOff: PropTypes.string,
  labelOn: PropTypes.string
}

export default SwitchWithInternalState
