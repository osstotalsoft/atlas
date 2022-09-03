import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Td, Tr } from 'react-super-responsive-table'
import { DeleteButton, EditButton, Typography, CustomDialog } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Box, makeStyles, Switch } from '@material-ui/core'
import styles from '../styles'

const useStyles = makeStyles(styles)

const SchellarItem = ({ schedule, onDelete, onEdit }) => {
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
          <Switch size='small' checked={schedule?.enabled} />
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
          <Switch size='small' checked={schedule?.parallelRuns} />
        </Td>
        <Td className={classes.tableContent}>
          <pre>{JSON.stringify(schedule?.workflowContext)}</pre>
        </Td>
        <Td className={classes.tableContent}>
          <Box textAlign='right' className={classes.buttonBox}>
            <EditButton size={'small'} color={'themeNoBackground'} title={t('General.Buttons.Edit')} onClick={handleEdit} />
            <DeleteButton size={'small'} title={t('General.Buttons.Delete')} color={'themeNoBackground'} onClick={toggleDeleteDialog} />
          </Box>
        </Td>
      </Tr>
      <CustomDialog
        id='deleteDialog'
        title={t('Schedule.Dialog.Delete')}
        maxWidth='xs'
        open={deleteDialog}
        showActions
        onYes={handleDelete}
        onClose={toggleDeleteDialog}
        textDialogYes={t('Dialog.Yes')}
        textDialogNo={t('Dialog.No')}
      />
    </>
  )
}

SchellarItem.propTypes = {
  schedule: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
}

export default SchellarItem
