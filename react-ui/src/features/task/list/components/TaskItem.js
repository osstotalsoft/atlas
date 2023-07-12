import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Tr, Td } from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import tableStyle from 'assets/jss/components/tableStyle'
import { Dialog, IconButton } from '@totalsoft/rocket-ui'

const useStyles = makeStyles(tableStyle)

const TaskItem = ({ task, onEditTask, onDeleteRow }) => {
  const { name, description } = task
  const { t } = useTranslation()
  const classes = useStyles()
  const [deleteDialog, setDeleteDialog] = useState(false)

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
        <Td className={classes.tableContent}>{description ? description : t('Task.NoDescription')}</Td>
        <Td className={classes.tableContent}>{t('DATE_FORMAT', { date: { value: task?.createTime, format: 'DD-MM-YYYY HH:mm:ss' } })}</Td>
        <Td className={classes.tableContent}>
          <Box textAlign='right'>
            <IconButton
              size='tiny'
              color='secondary'
              variant='text'
              type='edit'
              title={t('General.Buttons.Edit')}
              onClick={handleEditTask}
            />
            <IconButton size='tiny' color='secondary' variant='text' type='delete' onClick={showDialog} />
          </Box>
        </Td>
      </Tr>
      <Dialog
        id='deleteDialog'
        title={t('Dialog.DeleteTaskQuestion')}
        maxWidth='xs'
        showX={false}
        open={deleteDialog}
        showActions
        onYes={handleDeleteTask}
        onClose={closeDialog}
        defaultActions
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
