import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { get } from '@totalsoft/rules-algebra-react'
import { Grid, Tabs, Tab, Box } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import { Button } from '@totalsoft/rocket-ui'
import InputParameters from './InputParameters'
import GeneralSettings from './GeneralSettings'
import AdvancedSettings from './AdvancedSettings'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { buildWfTaskValidator, buildWfEventTaskValidator } from '../../../common/validator'
import { useDirtyFieldValidation } from '@totalsoft/pure-validations-react'

const EditTaskModal = ({ onCancel, onSave, inputsLens, dirtyInfo, onPayloadChange, workflowTasks, readOnly }) => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)

  const inputs = inputsLens.inputs |> get
  const task = inputsLens |> get

  const [initialName] = useState(inputs?.taskReferenceName)
  const [initialWorkflowTasks] = useState(workflowTasks)

  const taskValidator = useMemo(
    () =>
      inputs.type === 'EVENT'
        ? buildWfEventTaskValidator(initialWorkflowTasks, initialName)
        : buildWfTaskValidator(initialWorkflowTasks, initialName),
    [initialName, initialWorkflowTasks, inputs.type]
  )

  const [validation, validate, resetValidation] = useDirtyFieldValidation(taskValidator)

  const handleTabChange = useCallback((_event, newValue) => {
    setTabIndex(newValue)
  }, [])

  const handleSave = useCallback(() => {
    if (!validate(task)) return
    resetValidation()
    onSave()
  }, [onSave, resetValidation, task, validate])

  useEffect(() => {
    validate(task, dirtyInfo)
  }, [dirtyInfo, task, validate])

  return (
    <Grid container justifyContent='flex-end' alignItems='center' spacing={2}>
      <Grid item xs={12}>
        <AppBar position='static' color='default'>
          <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor='secondary' textColor='secondary' variant='fullWidth'>
            <Tab label={t('EditTaskModal.Tabs.General')} />
            <Tab label={t('EditTaskModal.Tabs.InputParameters')} disabled={!nodeConfig[inputs?.type].hasParametersTab} />
            <Tab label={t('EditTaskModal.Tabs.Advanced')} />
          </Tabs>
        </AppBar>
        <Grid style={{ marginTop: '20px' }} item xs={12}>
          {tabIndex == 0 && <GeneralSettings inputsLens={inputsLens.inputs} validation={validation?.inputs} />}
          {tabIndex == 1 && (
            <InputParameters
              inputParametersLens={inputsLens.inputs.inputParameters}
              inputTemplate={inputsLens.inputs.inputTemplate}
              nodeType={inputs?.type}
              onPayloadChange={onPayloadChange}
            />
          )}
          {tabIndex == 2 && <AdvancedSettings inputsLens={inputsLens.inputs} validation={validation?.inputs} />}
        </Grid>
      </Grid>
      <Box marginTop='20px'>
        <Button color='primary' size='small' style={{ marginRight: '20px' }} onClick={handleSave} disabled={readOnly}>
          {t('General.Buttons.Save')}
        </Button>
        <Button color='primary' size='small' onClick={onCancel}>
          {t('General.Buttons.Cancel')}
        </Button>
      </Box>
    </Grid>
  )
}

EditTaskModal.propTypes = {
  inputsLens: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onPayloadChange: PropTypes.func.isRequired,
  workflowTasks: PropTypes.array.isRequired,
  dirtyInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  readOnly: PropTypes.bool.isRequired
}

export default EditTaskModal
