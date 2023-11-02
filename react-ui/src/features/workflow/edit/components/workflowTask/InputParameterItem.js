import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { TextField, IconButton } from '@totalsoft/rocket-ui'
import { get, set } from '@totalsoft/rules-algebra-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { useTranslation } from 'react-i18next'
import Editor from '@monaco-editor/react'

function InputParameterItem({ valueLens, param, onRemove, isFromTemplate, typeFromTemplate }) {
  const { t } = useTranslation()
  const value = valueLens |> get

  const onInputTemplateChange = useCallback(
    value => {
      set(valueLens, value)
    },
    [valueLens]
  )

  const isJson = () => {
    return typeFromTemplate === 'object'
  }

  return (
    <Grid item container xs={12} md={6} spacing={2}>
      {isJson() ? (
        <Grid item xs={12}>
          <Typography>{param}</Typography>
          <Editor
            theme='vs-light'
            language='json'
            autoIndent={true}
            options={{
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              selectOnLineNumbers: true,
              minimap: {
                enabled: false
              }
            }}
            width='100%'
            height={'300px'}
            value={value}
            onChange={onInputTemplateChange}
          />
        </Grid>
      ) : (
        <Grid item xs={10}>
          <TextField
            fullWidth
            label={param}
            value={typeof value === 'object' ? JSON.stringify(value) : value}
            onChange={valueLens |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
            multiline
            maxRows={5}
          />
        </Grid>
      )}
      <Grid item xs={2}>
        {!isFromTemplate && (
          <IconButton
            key='deleteButton'
            type='delete'
            color='secondary'
            variant='text'
            title={t('General.Buttons.Delete')}
            onClick={onRemove}
          />
        )}
      </Grid>
    </Grid>
  )
}

InputParameterItem.propTypes = {
  valueLens: PropTypes.object.isRequired,
  param: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  isFromTemplate: PropTypes.bool,
  typeFromTemplate: PropTypes.string
}

export default InputParameterItem
