import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import InputParameterItem from './InputParameterItem'
import { get, over, set } from '@totalsoft/rules-algebra-react'
import { dissoc, keys } from 'ramda'
function InputParametersList({ inputParametersLens, inputTemplate }) {
  const inputParameters = inputParametersLens |> get
  const properties = keys(inputParameters)
  const template = keys(inputTemplate |> get)

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
            <InputParameterItem
              key={index}
              valueLens={inputParametersLens[param]}
              param={param}
              isFromTemplate={template.includes(param)}
              typeFromTemplate={inputTemplate[param] |> get}
              onRemove={handleRemoveItem(param)}
            />
          )
      )}
    </Grid>
  )
}

InputParametersList.propTypes = {
  inputParametersLens: PropTypes.object.isRequired,
  inputTemplate: PropTypes.object
}

export default InputParametersList
