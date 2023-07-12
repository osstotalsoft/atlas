import React, { useCallback, useState } from 'react'
import { Grid } from '@mui/material'
import PropTypes from 'prop-types'
import { set } from '@totalsoft/rules-algebra-react'
import { TextField, IconButton } from '@totalsoft/rocket-ui'
import { emptyString } from 'utils/constants'
import { useTranslation } from 'react-i18next'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { commonTaskDefHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'

function InputParametersHeader({ inputParametersLens }) {
  const { t } = useTranslation()

  const [localParam, setLocalParam] = useState()

  const handleParamChange = useCallback(value => {
    setLocalParam(value)
  }, [])

  const handleAddParameter = useCallback(() => {
    if (localParam) {
      set(inputParametersLens[localParam], `\${workflow.input.${localParam}}`)
      setLocalParam(emptyString)
    }
  }, [inputParametersLens, localParam])

  const handleKeyPressed = useCallback(({ keyCode }) => keyCode === 13 && handleAddParameter(), [handleAddParameter])

  return (
    <Grid container spacing={3} onKeyDown={handleKeyPressed}>
      <Grid item container xs={12} md={6} spacing={2} alignItems='center'>
        <Grid item xs={10}>
          <TextField
            fullWidth
            label={t('WorkflowTask.InputParameter.DefaultText')}
            value={localParam}
            onChange={handleParamChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            key='addButton'
            type='add'
            variant='text'
            color='secondary'
            size='small'
            fontSize='small'
            title={t('WorkflowTask.Buttons.AddParameter')}
            onClick={handleAddParameter}
          />
          <Help icon={<CustomHelpIcon />} iconSize='small' helpConfig={commonTaskDefHelpConfig.ADD_NEW_PARAM} hasTranslations={true} />
        </Grid>
      </Grid>
    </Grid>
  )
}

InputParametersHeader.propTypes = {
  inputParametersLens: PropTypes.object.isRequired
}

export default InputParametersHeader
