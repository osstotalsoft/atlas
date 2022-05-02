import React from 'react'
import PropTypes from 'prop-types'
import { get } from '@totalsoft/react-state-lens'
import ActionDetailsCompleteFail from './ActionDetailsCompleteFail'
import ActionDetailsStart from './ActionDetailsStart'
import { actionType } from '../../../common/constants'

const ActionDetails = ({ actionLens, disableSave }) => {
  const { action } = actionLens |> get
  const actionDetailsLens =
    action === actionType.COMPLETE_TASK
      ? actionLens.completeTask
      : action === actionType.FAIL_TASK
      ? actionLens.failTask
      : actionLens.startWorkflow

  return action === actionType.START_WORKFLOW ? (
    <ActionDetailsStart actionDetailsLens={actionDetailsLens} disableSave={disableSave} />
  ) : (
    <ActionDetailsCompleteFail actionDetailsLens={actionDetailsLens} disableSave={disableSave} />
  )
}

ActionDetails.propTypes = {
  actionLens: PropTypes.object.isRequired,
  disableSave: PropTypes.func.isRequired
}

export default ActionDetails
