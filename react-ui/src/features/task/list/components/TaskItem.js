import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Tr, Td } from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next'
import { Box, makeStyles } from '@material-ui/core'
import tableStyle from 'assets/jss/components/tableStyle'
import { CustomDialog, DeleteButton, EditButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import { isJsonString } from 'utils/functions'

const useStyles = makeStyles(tableStyle)

const TaskItem = ({ task, onEditTask, onDeleteRow }) => {
  const { name, description } = task
  const { t } = useTranslation()
  const classes = useStyles()
  const [deleteDialog, setDeleteDialog] = useState(false)

  const desc = isJsonString(description) ? JSON.parse(description)?.description : description

  const handleEditTask = useCallback(() => onEditTask(task.name), [onEditTask, task.name])
  const closeDialog = useCallback(() => {
    setDeleteDialog(false)
  }, [])
  const showDialog = useCallback(() => {
    setDeleteDialog(true)
  }, [])

  const handleDeleteTask = useCallback(() => {
    onDeleteRow(task?.name)
    closeDialog()
  }, [closeDialog, onDeleteRow, task?.name])

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>{name}</Td>
        <Td className={classes.tableContent}>{desc ? desc : t('Task.NoDescription')}</Td>
        <Td className={classes.tableContent}>{t('DATE_FORMAT', { date: { value: task?.createTime, format: 'DD-MM-YYYY HH:mm:ss' } })}</Td>
        <Td className={classes.tableContent}>
          <Box textAlign='right'>
            <EditButton size={'small'} color={'themeNoBackground'} title={t('General.Buttons.Edit')} onClick={handleEditTask} />
            <DeleteButton size={'small'} color={'themeNoBackground'} onClick={showDialog} />
          </Box>
        </Td>
      </Tr>
      <CustomDialog
        id='deleteDialog'
        title={t('Dialog.DeleteTaskQuestion')}
        maxWidth='xs'
        open={deleteDialog}
        showActions
        onYes={handleDeleteTask}
        onClose={closeDialog}
        textDialogYes={t('Dialog.Yes')}
        textDialogNo={t('Dialog.No')}
      />
    </>
  )
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired
}

export default TaskItem
