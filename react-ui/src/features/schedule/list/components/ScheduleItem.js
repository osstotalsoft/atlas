import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Td, Tr } from 'react-super-responsive-table'
import { IconButton, Typography, Dialog } from '@totalsoft/rocket-ui'
import { Box, Switch } from '@mui/material'
import { makeStyles } from '@mui/styles'
import styles from '../styles'

const useStyles = makeStyles(styles)

const ScheduleItem = ({ schedule, onDelete, onEdit }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [deleteDialog, showDelete] = useState(false)
  const toggleDeleteDialog = useCallback(() => {
    showDelete(current => !current)
  }, [])

  const handleDelete = useCallback(() => {
    onDelete(schedule.name)
    toggleDeleteDialog()
  }, [schedule.name, onDelete, toggleDeleteDialog])

  const handleEdit = useCallback(() => {
    onEdit(schedule)
  }, [schedule, onEdit])

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>
          <Switch size='small' color='secondary' checked={schedule?.enabled} />
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{schedule?.name}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <span className={classes.breakWordSpan}>{schedule?.workflowName + '/' + schedule?.workflowVersion}</span>
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{schedule?.cronString}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Switch size='small' color='secondary' checked={schedule?.parallelRuns} />
        </Td>
        <Td className={classes.tableContent}>
          <pre>{JSON.stringify(schedule?.workflowContext)}</pre>
        </Td>
        <Td className={classes.tableContent}>
          <Box textAlign='right' className={classes.buttonBox}>
            <IconButton size='tiny' variant='text' color='secondary' type='edit' title={t('General.Buttons.Edit')} onClick={handleEdit} />
            <IconButton size='tiny' variant='text' color='secondary' type='delete' title={t('General.Buttons.Delete')} onClick={toggleDeleteDialog} />
          </Box>
        </Td>
      </Tr>
      <Dialog
        id='deleteDialog'
        title={t('Schedule.Dialog.Delete')}
        maxWidth='xs'
        open={deleteDialog}
        defaultActions 
        onYes={handleDelete}
        onClose={toggleDeleteDialog}
        showX={false}
      />
    </>
  )
}

ScheduleItem.propTypes = {
  schedule: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
}

export default ScheduleItem
