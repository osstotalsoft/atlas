import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Td, Tr } from 'react-super-responsive-table'
import { DeleteButton, EditButton, Typography, CustomDialog } from '@bit/totalsoft_oss.react-mui.kit.core'
import styles from '../styles/styles'
import { Box, makeStyles, Switch } from '@material-ui/core'
import omitDeep from 'omit-deep-lodash'

const useStyles = makeStyles(styles)

const EventHandlerItem = ({ handler, onDeleteHandler, onEditHandler }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [deleteDialog, showDelete] = useState(false)
  const toggleDeleteDialog = useCallback(() => {
    showDelete(current => !current)
  }, [])

  const handleDeleteHandler = useCallback(() => {
    onDeleteHandler(handler.name)
    toggleDeleteDialog()
  }, [handler.name, onDeleteHandler, toggleDeleteDialog])

  const handleEditHandler = useCallback(() => {
    onEditHandler(handler)
  }, [handler, onEditHandler])

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>
          <Switch size='small' checked={handler?.active} />
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{handler?.name}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <span className={classes.breakWordSpan}>{handler?.event}</span>
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{handler?.condition || '-'}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <pre>{JSON.stringify(omitDeep(handler?.actions, ['__typename']), null, 3)}</pre>
        </Td>
        <Td className={classes.tableContent}>
          <Box textAlign='right' className={classes.buttonBox}>
            <EditButton size={'small'} color={'themeNoBackground'} title={t('General.Buttons.Edit')} onClick={handleEditHandler} />
            <DeleteButton size={'small'} title={t('General.Buttons.Delete')} color={'themeNoBackground'} onClick={toggleDeleteDialog} />
          </Box>
        </Td>
      </Tr>
      <CustomDialog
        id='deleteDialog'
        title={t('EventHandler.Dialog.Delete')}
        maxWidth='xs'
        open={deleteDialog}
        showActions
        onYes={handleDeleteHandler}
        onClose={toggleDeleteDialog}
        textDialogYes={t('Dialog.Yes')}
        textDialogNo={t('Dialog.No')}
      />
    </>
  )
}

EventHandlerItem.propTypes = {
  handler: PropTypes.object.isRequired,
  onDeleteHandler: PropTypes.func.isRequired,
  onEditHandler: PropTypes.func.isRequired
}

export default EventHandlerItem
