import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Td, Tr } from 'react-super-responsive-table'
import { FormControlLabel, Grid, Switch } from '@mui/material'
import { makeStyles } from '@mui/styles'
import styles from 'assets/jss/components/tableStyle'
import { useTranslation } from 'react-i18next'
import { get, set } from '@totalsoft/react-state-lens'
import { IconButton, Autocomplete } from '@totalsoft/rocket-ui'
import { actionTypeList, actionType } from '../../../common/constants'
import { emptyString } from 'utils/constants'
import { isValid, getErrors } from '@totalsoft/pure-validations-react'
import ActionHeaderStart from './ActionHeaderStart'
import ActionHeaderCompleteFail from './ActionHeaderCompleteFail'

const useStyles = makeStyles(styles)

const Action = ({ actionLens, onEditAction, onDeleteAction, onSaveAction, onCancelEdit, saveDisabled, editInProgress, validation }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const action = actionLens |> get
  const actionName = action?.action
  const editMode = action?.editMode

  const actionDetailsLens =
    actionName === actionType.COMPLETE_TASK
      ? actionLens?.completeTask
      : actionName === actionType.FAIL_TASK
      ? actionLens?.failTask
      : actionLens?.startWorkflow

  const handlePropertyChanged = useCallback(() => {
    set(actionLens?.expandInlineJSON, !action?.expandInlineJSON)
  }, [action?.expandInlineJSON, actionLens?.expandInlineJSON])

  const handleEditAction = useCallback(() => {
    onEditAction(action)
    set(actionLens?.editMode, true)
  }, [action, actionLens.editMode, onEditAction])

  const handleActionTypeChange = useCallback(action => set(actionLens, { editMode: true, action }), [actionLens])

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                options={actionTypeList}
                valueKey='name'
                simpleValue
                value={action?.action || emptyString}
                onChange={handleActionTypeChange}
                disabled={!editMode}
                error={!isValid(validation?.action)}
                helperText={getErrors(validation?.action)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              {action.action !== actionType.START_WORKFLOW ? (
                <FormControlLabel
                  control={<Switch checked={action?.expandInlineJSON || false} onChange={handlePropertyChanged} disabled={!editMode} />}
                  label={t('EventHandler.ExpandInlineJSON')}
                />
              ) : null}
            </Grid>
            <Grid item container xs={12} sm={2} lg={2} justifyContent='flex-end'>
              {editInProgress ? (
                <>
                  <IconButton
                    size='small'
                    fontSize='medium'
                    color='secondary'
                    type='save'
                    variant='text'
                    title={t('General.Buttons.Save')}
                    onClick={onSaveAction}
                    disabled={saveDisabled}
                  />
                  <IconButton
                    size='small'
                    fontSize='medium'
                    color='secondary'
                    type='cancel'
                    variant='text'
                    title={t('General.Buttons.Cancel')}
                    onClick={onCancelEdit}
                  />
                </>
              ) : (
                <>
                  <IconButton
                    size='tiny'
                    color='secondary'
                    variant='text'
                    type='edit'
                    title={t('General.Buttons.Edit')}
                    onClick={handleEditAction}
                  />
                  <IconButton
                    size='tiny'
                    color='secondary'
                    variant='text'
                    type='delete'
                    title={t('General.Buttons.Delete')}
                    onClick={onDeleteAction}
                  />
                </>
              )}
            </Grid>
            {actionName === actionType.START_WORKFLOW ? (
              <ActionHeaderStart actionDetailsLens={actionDetailsLens} editMode={editMode || false} />
            ) : (
              <ActionHeaderCompleteFail actionDetailsLens={actionDetailsLens} editMode={editMode || false} />
            )}
          </Grid>
        </Td>
      </Tr>
    </>
  )
}

Action.propTypes = {
  actionLens: PropTypes.object.isRequired,
  onEditAction: PropTypes.func.isRequired,
  onDeleteAction: PropTypes.func.isRequired,
  onSaveAction: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  saveDisabled: PropTypes.bool,
  editInProgress: PropTypes.bool,
  validation: PropTypes.object.isRequired
}

export default Action
