import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Td, Tr } from 'react-super-responsive-table'
import { IconButton, Typography, Dialog } from '@totalsoft/rocket-ui'
import styles from '../styles/styles'
import { Box, Switch, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import omitDeep from 'omit-deep-lodash'
import ReactJson from 'react-json-view'

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
          <Switch size='small' color='secondary' checked={handler?.active} />
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{handler?.name}</Typography>
        </Td>
        <Td className={classes.tableContent} style={{ minWidth: 100 }}>
          <Tooltip title={handler?.event}>
            <span className={classes.breakWordSpan}>{`${handler?.event.split(':').slice(0, 1)}:${handler?.event
              .split('.')
              .slice(-1)}`}</span>
          </Tooltip>
        </Td>
        <Td className={classes.tableContent}>
          <Typography style={{ maxWidth: 350 }}>{handler?.condition || '-'}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <ReactJson
            src={omitDeep(handler?.actions, ['__typename'])}
            name={false}
            displayDataTypes={false}
            collapsed={2}
            style={{ wordBreak: 'break-word', minWidth: 300 }}
          />
          {/*<pre>{JSON.stringify(omitDeep(handler?.actions, ['__typename']), null, 3)}</pre>*/}
        </Td>
        <Td className={classes.tableContent}>
          <Box textAlign='right' className={classes.buttonBox}>
            <IconButton
              size='tiny'
              color='secondary'
              variant='text'
              type='edit'
              title={t('General.Buttons.Edit')}
              onClick={handleEditHandler}
            />
            <IconButton
              size='tiny'
              color='secondary'
              variant='text'
              type='delete'
              title={t('General.Buttons.Delete')}
              onClick={toggleDeleteDialog}
            />
          </Box>
        </Td>
      </Tr>
      <Dialog
        id='deleteDialog'
        title={t('EventHandler.Dialog.Delete')}
        maxWidth='xs'
        open={deleteDialog}
        showActions
        onYes={handleDeleteHandler}
        onClose={toggleDeleteDialog}
        defaultActions
        showX={false}
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
