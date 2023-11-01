import React, { useCallback, useState } from 'react'
import Editor from '@monaco-editor/react'
import { get } from '@totalsoft/rules-algebra-react'
import PropTypes from 'prop-types'
import { Divider, Paper, Grid } from '@mui/material'
import { Typography } from '@totalsoft/rocket-ui'
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

  const handleChange = useCallback(
    value => {
      setLocalState(value)
      onPayloadChange(value)
    },
    [onPayloadChange]
  )

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
      <Editor
        debounceChangePeriod={200}
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
        height='300px'
        value={localState}
        onChange={handleChange}
      />
    </>
  )
}

EventNodeInputParameters.propTypes = {
  inputParametersLens: PropTypes.object.isRequired,
  onPayloadChange: PropTypes.func.isRequired
}

export default EventNodeInputParameters
