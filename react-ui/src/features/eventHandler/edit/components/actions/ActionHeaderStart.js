import React from 'react'
import { Grid } from '@mui/material'
import { get, set } from '@totalsoft/react-state-lens'
import PropTypes from 'prop-types'
import { TextField } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'

const ActionHeaderStart = ({ actionDetailsLens, editMode }) => {
  const { t } = useTranslation()
  const actionDetails = actionDetailsLens |> get

  return (
    <>
      <Grid item xs={12} sm={6} lg={6}>
        <TextField
          label={t('EventHandler.WorkflowName')}
          fullWidth
          value={actionDetails?.name || emptyString}
          onChange={actionDetailsLens.name |> set |> onTextBoxChange}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6}>
        <TextField
          label={t('EventHandler.Version')}
          fullWidth
          isNumeric
          inputProps={{
            decimalScale: 0,
            thousandSeparator: false,
            allowNegative: false
          }}
          value={actionDetails?.version || emptyString}
          onChange={actionDetailsLens.version |> set}
          disabled={!editMode}
        />
      </Grid>
    </>
  )
}

ActionHeaderStart.propTypes = {
  actionDetailsLens: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired
}

export default ActionHeaderStart
