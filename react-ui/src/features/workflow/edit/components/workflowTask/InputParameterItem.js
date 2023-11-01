import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { TextField, IconButton } from '@totalsoft/rocket-ui'
import { get, set } from '@totalsoft/rules-algebra-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { useTranslation } from 'react-i18next'
import JsonLint from 'jsonlint-mod'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'

function InputParameterItem({ valueLens, param, onRemove, isFromTemplate, typeFromTemplate }) {
  const { t } = useTranslation()
  const value = valueLens |> get
  const [annotations, setAnnotations] = useState()

  const onInputTemplateChange = useCallback(
    value => {
      set(valueLens, value)
      try {
        JsonLint.parse(value)
        setAnnotations(null)
      } catch (e) {
        const row = parseInt(e.message.match(/Parse error on line (\d+)/)[1]) - 1
        const annotation = { row, text: e.message, type: 'error' }
        setAnnotations([annotation])
      }
    },
    [valueLens]
  )

  const isJson = () => {
    return typeFromTemplate === "object";
    /*
    try {
      JSON.parse(value)
      if ()
      return true
    } catch {
      return false
    }*/
  }

  return (
    <Grid item container xs={12} md={6} spacing={2}>
      {isJson() ? (
        <Grid item xs={12}>
          <Typography>{param}</Typography>
          <AceEditor
            setOptions={{ useWorker: false }}
            mode={'json'}
            width='100%'
            height={'300px'}
            theme='tomorrow'
            fontSize={16}
            annotations={annotations}
            debounceChangePeriod={200}
            value={value}
            onChange={onInputTemplateChange}
            wrapEnabled={true}
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
