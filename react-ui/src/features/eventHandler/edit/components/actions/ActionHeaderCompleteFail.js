import React from 'react'
import { Grid } from '@mui/material'
import { get, set } from '@totalsoft/react-state-lens'
import PropTypes from 'prop-types'
import { CustomTextField } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'

const ActionHeaderCompleteFail = ({ actionDetailsLens, editMode }) => {
  const { t } = useTranslation()
  const actionDetails = actionDetailsLens |> get

  return (
    <>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label={t('EventHandler.WorkflowId')}
          fullWidth
          value={actionDetails?.workflowId || emptyString}
          onChange={actionDetailsLens.workflowId |> set |> onTextBoxChange}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label={t('EventHandler.TaskRefName')}
          fullWidth
          value={actionDetails?.taskRefName || emptyString}
          onChange={actionDetailsLens.taskRefName |> set |> onTextBoxChange}
          disabled={!editMode}
        />
      </Grid>
    </>
  )
}

ActionHeaderCompleteFail.propTypes = {
  actionDetailsLens: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired
}

export default ActionHeaderCompleteFail
