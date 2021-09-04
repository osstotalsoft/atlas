import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Tr, Td } from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next'
import { Box, makeStyles } from '@material-ui/core'
import styles from '../../common/styles'
import { CustomDialog, DeleteButton, EditButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import ExecuteWorkflowModal from '../../modals/ExecuteWorkflowModal'
import { isJsonString } from 'utils/functions'
import ExecuteButton from 'features/common/components/ExecuteButton'
import { emptyObject } from 'utils/constants'
import { useStateLens } from '@totalsoft/react-state-lens'
import { emptyString } from 'utils/constants'

const useStyles = makeStyles(styles)

const WorkflowItem = ({ workflow, onEditWorkflow, onDeleteWorkflow }) => {
  const { name, version, description, createdBy, updatedBy } = workflow
  const { t } = useTranslation()
  const classes = useStyles()

  const [deleteDialog, setDeleteDialog] = useState(false)
  const [execDialog, setExecDialog] = useState(false)
  const inputLens = useStateLens(emptyObject)

  const desc = isJsonString(description) ? JSON.parse(description)?.description : description

  const handleEditWorkflow = useCallback(() => onEditWorkflow(workflow.name), [onEditWorkflow, workflow.name])
  const closeDialog = useCallback(() => {
    setDeleteDialog(false)
  }, [])
  const showDialog = useCallback(() => {
    setDeleteDialog(true)
  }, [])

  const handleDeleteWorkflow = useCallback(() => {
    onDeleteWorkflow(name, version)
    closeDialog()
  }, [closeDialog, name, onDeleteWorkflow, version])

  const toggleExecDialog = useCallback(() => {
    setExecDialog(current => !current)
  }, [])

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>{name}</Td>
        <Td className={classes.tableContent}>{version}</Td>
        <Td className={classes.tableContent}>{desc ? desc : t('Workflow.NoDescription')}</Td>
        <Td className={classes.tableContent}>{createdBy}</Td>
        <Td className={classes.tableContent}>{updatedBy}</Td>
        <Td className={classes.tableContent}>
          <Box textAlign='right'>
            <EditButton size={'small'} color={'themeNoBackground'} title={t('General.Buttons.Edit')} onClick={handleEditWorkflow} />
            <ExecuteButton title={t('Workflow.Buttons.Execute')} onClick={toggleExecDialog} />
            <DeleteButton size={'small'} title={t('General.Buttons.Delete')} color={'themeNoBackground'} onClick={showDialog} />
          </Box>
        </Td>
      </Tr>
      <CustomDialog
        id='deleteDialog'
        title={t('Workflow.Dialog.DeleteWorkflow')}
        maxWidth='xs'
        open={deleteDialog}
        showActions
        onYes={handleDeleteWorkflow}
        onClose={closeDialog}
        textDialogYes={t('Dialog.Yes')}
        textDialogNo={t('Dialog.No')}
      />
      <ExecuteWorkflowModal
        open={execDialog}
        toggleExecDialog={toggleExecDialog}
        name={workflow?.name || emptyString}
        inputLens={inputLens}
      />
    </>
  )
}

WorkflowItem.propTypes = {
  workflow: PropTypes.object.isRequired,
  onEditWorkflow: PropTypes.func.isRequired,
  onDeleteWorkflow: PropTypes.func.isRequired
}

export default WorkflowItem
