import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import InputParameterItem from './InputParameterItem'
import { get, over } from '@totalsoft/rules-algebra-react'
import { dissoc, keys } from 'ramda'
function InputParametersList({ inputParametersLens }) {
  const inputParameters = inputParametersLens |> get
  const properties = keys(inputParameters)

  const handleRemoveItem = useCallback(
    key => () => {
      over(inputParametersLens, dissoc(key))
    },
    [inputParametersLens]
  )

  return (
    <Grid container spacing={2}>
      {properties?.map(
        (param, index) =>
          param !== 'scriptExpression' && (
            <InputParameterItem key={index} valueLens={inputParametersLens[param]} param={param} onRemove={handleRemoveItem(param)} />
          )
      )}
    </Grid>
  )
}

InputParametersList.propTypes = {
  inputParametersLens: PropTypes.object.isRequired
}

export default InputParametersList
