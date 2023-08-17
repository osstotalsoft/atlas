import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Tr, Td } from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import styles from '../../common/styles'
import { Dialog, IconButton, Button } from '@totalsoft/rocket-ui'
import ExecuteWorkflowModal from '../../common/components/ExecuteWorkflowModal'
import ExecuteButton from 'features/common/components/ExecuteButton'
import { emptyObject } from 'utils/constants'
import { useStateLens } from '@totalsoft/react-state-lens'
import { emptyString } from 'utils/constants'
import FileCopy from '@mui/icons-material/FileCopy'
import AddNameModal from 'features/workflow/common/components/AddNameModal'
import { useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { get } from '@totalsoft/rules-algebra-react'
import workflowConfig from 'features/designer/constants/WorkflowConfig'
import { Checkbox, FormControlLabel } from '@mui/material'

const useStyles = makeStyles(styles)

const WorkflowItem = ({ workflow, onEditWorkflow, onDeleteWorkflow, onCloneWorkflow, selected, onSelect }) => {
  const { name, version, description, createdBy, updatedBy } = workflow
  const { t } = useTranslation()
  const classes = useStyles()

  const [deleteDialog, setDeleteDialog] = useState(false)
  const [execDialog, setExecDialog] = useState(false)
  const [cloneDialog, setCloneDialog] = useState(false)

  const inputLens = useStateLens(emptyObject)
  const [nameLens, nameDirtyInfo, resetName] = useChangeTrackingLens(emptyString)
  const [versionLens, versionDirtyInfo, resetVersion] = useChangeTrackingLens(workflowConfig.version)

  const handleEditWorkflow = useCallback(
    () => onEditWorkflow(workflow?.name, workflow?.version),
    [onEditWorkflow, workflow?.name, workflow?.version]
  )

  const toggleExecDialog = useCallback(() => {
    setExecDialog(current => !current)
  }, [])

  const closeCloneDialog = useCallback(() => {
    setCloneDialog(false)
    resetName()
  }, [resetName])

  const showCloneDialog = useCallback(() => {
    setCloneDialog(true)
    resetName()
    resetVersion()
  }, [resetName, resetVersion])

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialog(false)
  }, [])

  const showDeleteDialog = useCallback(() => {
    setDeleteDialog(true)
  }, [])

  const handleCloneWorkflow = useCallback(() => {
    onCloneWorkflow(name, version, nameLens |> get, versionLens |> get)
    setCloneDialog(false)
  }, [name, nameLens, onCloneWorkflow, version, versionLens])

  const handleDeleteWorkflow = useCallback(() => {
    onDeleteWorkflow(name, version)
    closeDeleteDialog()
  }, [closeDeleteDialog, name, onDeleteWorkflow, version])

  const handleSelect = useCallback(
    name => event => {
      onSelect(name, event.target.checked)
    },
    [onSelect]
  )

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>
          <FormControlLabel
            control={
              <Checkbox color='primary' checked={selected?.includes(`${name}/${version}`)} onChange={handleSelect(`${name}/${version}`)} />
            }
            label=''
          />
        </Td>
        <Td className={classes.tableContent}>
          <ExecuteButton title={t('Workflow.Buttons.Execute')} onClick={toggleExecDialog} />
        </Td>
        <Td className={classes.tableContent}>{name}</Td>
        <Td className={classes.tableContent}>{version}</Td>
        <Td className={classes.tableContent}>{description ? description : t('Workflow.NoDescription')}</Td>
        <Td className={classes.tableContent}>{createdBy}</Td>
        <Td className={classes.tableContent}>{updatedBy}</Td>
        <Td className={classes.tableContent}>
          <Box textAlign='right' style={{ display: 'flex' }}>
            <IconButton
              type='edit'
              variant='text'
              size='tiny'
              color='secondary'
              title={t('General.Buttons.Edit')}
              onClick={handleEditWorkflow}
            />
            <IconButton color='secondary' tooltip={t('Workflow.Buttons.Clone')} variant='text' size='tiny' onClick={showCloneDialog}>
              <FileCopy />
            </IconButton>
            <IconButton
              type='delete'
              variant='text'
              size='tiny'
              title={t('General.Buttons.Delete')}
              color='secondary'
              onClick={showDeleteDialog}
            />
          </Box>
        </Td>
      </Tr>
      <Dialog
        id='cloneDialog'
        title={t('Workflow.Dialog.CloneWorkflow')}
        maxWidth='xs'
        open={cloneDialog}
        showX={false}
        actions={
          <>
            <Button onClick={handleCloneWorkflow} color='secondary' variant='contained' size='small'>
              {t('Workflow.Buttons.Clone')}
            </Button>
            <Button onClick={closeCloneDialog} color='primary' variant='contained' size='small'>
              {t('Workflow.Buttons.Cancel')}
            </Button>
          </>
        }
        content={<AddNameModal nameLens={nameLens} versionLens={versionLens} dirtyInfo={nameDirtyInfo || versionDirtyInfo} />}
      />
      <Dialog
        id='deleteDialog'
        title={t('Workflow.Dialog.DeleteWorkflow')}
        maxWidth='xs'
        open={deleteDialog}
        defaultActions
        showX={false}
        onYes={handleDeleteWorkflow}
        onClose={closeDeleteDialog}
      />
      {execDialog && (
        <ExecuteWorkflowModal
          open={execDialog}
          toggleExecDialog={toggleExecDialog}
          name={workflow?.name || emptyString}
          version={workflow?.version || 0}
          inputLens={inputLens}
        />
      )}
    </>
  )
}

WorkflowItem.propTypes = {
  workflow: PropTypes.object.isRequired,
  onEditWorkflow: PropTypes.func.isRequired,
  onDeleteWorkflow: PropTypes.func.isRequired,
  onCloneWorkflow: PropTypes.func.isRequired,
  selected: PropTypes.array,
  onSelect: PropTypes.func
}

export default WorkflowItem
