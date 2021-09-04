import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Grid } from '@material-ui/core'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import { get, set } from '@totalsoft/change-tracking-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { emptyString } from 'utils/constants'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import { isValid, getErrors } from '@totalsoft/pure-validations-react'

const EventHandlerData = ({ handlerLens, validation }) => {
  const { t } = useTranslation()
  const handler = handlerLens |> get

  const handlePropertyChanged = useCallback(() => {
    set(handlerLens.active, !handler?.active)
  }, [handler?.active, handlerLens])

  return (
    <Grid container spacing={2} justifyContent='flex-start' alignItems='flex-end'>
      <Grid item xs={12} sm={6} lg={6}>
        <CustomTextField
          label={t('EventHandler.Name')}
          fullWidth
          value={handler?.name || emptyString}
          onChange={handlerLens.name |> set |> onTextBoxChange}
          error={!isValid(validation?.name)}
          helperText={getErrors(validation?.name)}
          debounceBy={200}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6}>
        <CustomTextField
          label={t('EventHandler.Sink')}
          fullWidth
          value={handler?.event || emptyString}
          onChange={handlerLens.event |> set |> onTextBoxChange}
          error={!isValid(validation?.event)}
          helperText={getErrors(validation?.event)}
          debounceBy={200}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label={t('EventHandler.Condition')}
          multiline
          fullWidth
          value={handler?.condition || emptyString}
          onChange={handlerLens.condition |> set |> onTextBoxChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={5}>
        <SwitchWithInternalState
          labelOn={t('EventHandler.Active')}
          labelOff={t('EventHandler.Inactive')}
          checked={handler?.active || false}
          onChange={handlePropertyChanged}
        />
      </Grid>
    </Grid>
  )
}

EventHandlerData.propTypes = {
  handlerLens: PropTypes.object.isRequired,
  validation: PropTypes.object.isRequired
}

export default EventHandlerData
