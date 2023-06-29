import React, { useCallback, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'
import JsonLint from 'jsonlint-mod'

import { get } from '@totalsoft/rules-algebra-react'
import PropTypes from 'prop-types'
import { Divider, Paper, Grid } from '@mui/material'
import { Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import { emptyObject } from 'utils/constants'
import { useTranslation } from 'react-i18next'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { eventHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'

const EventNodeInputParameters = ({ inputParametersLens, onPayloadChange }) => {
  const { t } = useTranslation()
  const payloadLens = process.env.REACT_APP_USE_NBB_MESSAGE === 'true' ? inputParametersLens?.Payload : inputParametersLens
  const payload = (payloadLens |> get) || emptyObject
  const [localState, setLocalState] = useState(JSON.stringify(payload, null, 4))
  const [annotations, setAnnotations] = useState()

  const handleChange = useCallback(
    value => {
      setLocalState(value)
      onPayloadChange(value)
    },
    [onPayloadChange]
  )

  useEffect(() => {
    try {
      JsonLint.parse(localState)
      setAnnotations(null)
    } catch (e) {
      const row = parseInt(e.message.match(/Parse error on line (\d+)/)[1]) - 1
      const annotation = { row, text: e.message, type: 'error' }
      setAnnotations([annotation])
    }
  }, [localState])

  return (
    <>
      <Paper elevation={2}>
        <Grid container justifyContent='center' alignItems='center' spacing={1}>
          <Grid item>
            <Typography align='center' variant='subtitle1'>{`${t('WorkflowTask.InputParameter.Payload')}:`}</Typography>
          </Grid>
          <Grid item>
            <Help icon={<CustomHelpIcon />} helpConfig={eventHelpConfig.PAYLOAD} hasTranslations={true} />
          </Grid>
        </Grid>
      </Paper>
      <Divider style={{ marginTop: '20px' }}></Divider>
      <AceEditor
        annotations={annotations}
        debounceChangePeriod={200}
        mode={'json'}
        width='100%'
        height='400px'
        theme='tomorrow'
        fontSize={16}
        value={localState}
        onChange={handleChange}
        wrapEnabled={true}
      />
    </>
  )
}

EventNodeInputParameters.propTypes = {
  inputParametersLens: PropTypes.object.isRequired,
  onPayloadChange: PropTypes.func.isRequired
}

export default EventNodeInputParameters
