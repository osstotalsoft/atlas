import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { Td, Tr } from 'react-super-responsive-table'
import { Typography, EditButton, IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import tableStyle from 'assets/jss/components/tableStyle'
import { useTranslation } from 'react-i18next'
import PreviewJsonDialog from '../../modals/PreviewJsonDialog'
import HistoryIcon from '@mui/icons-material/History'
import { CustomDialog } from '@bit/totalsoft_oss.react-mui.kit.core'
import CompareDefinitionDialog from '../modals/CompareDefinitionDialog'
import { emptyObject } from 'utils/constants'

const useStyles = makeStyles(tableStyle)

const WorkflowHistoryItem = ({ history, workflow, isLatest, onRevert }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [previewDialog, setPreviewDialog] = useState(false)
  const [revertDialog, setRevertDialog] = useState(false)
  const [compareDialog, setCompareDialog] = useState(false)
  const timeStamp = t('DATE_FORMAT', { date: { value: history?.timeStamp, format: 'DD-MM-YY HH:mm:ss' } })

  const handleToggleCompare = useCallback(() => setCompareDialog(current => !current), [])

  const togglePreviewDialog = useCallback(() => {
    setPreviewDialog(current => !current)
  }, [])

  const toggleRevertDialog = useCallback(() => {
    setRevertDialog(current => !current)
  }, [])

  const handleRevertWorkflow = useCallback(() => {
    onRevert(history?.definition)
    toggleRevertDialog(true) //Close
  }, [history?.definition, onRevert, toggleRevertDialog])

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>
          <Typography>{timeStamp || '-'}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{history?.changedBy}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={4}>
              <EditButton
                title={'Edit'}
                size='small'
                color='themeNoBackground'
                tooltip={t('Execution.Buttons.SeeDetails')}
                editMode={false}
                onClick={togglePreviewDialog}
              />
            </Grid>
            <Grid item xs={4}>
              <IconButton
                size='small'
                tooltip={isLatest ? t('WorkflowHistory.Buttons.CurrentDefinition') : t('WorkflowHistory.Buttons.Revert')}
                color='themeNoBackground'
                disabled={isLatest}
                onClick={toggleRevertDialog}
              >
                <HistoryIcon fontSize='small' />
              </IconButton>
            </Grid>
            <Grid item xs={4}>
              <IconButton
                size='small'
                tooltip={t('WorkflowHistory.Buttons.Compare')}
                color='themeNoBackground'
                onClick={handleToggleCompare}
              >
                <CompareArrowsIcon fontSize='small' />
              </IconButton>
            </Grid>
          </Grid>
        </Td>
      </Tr>
      <PreviewJsonDialog open={previewDialog} onClose={togglePreviewDialog} workflow={history?.definition || emptyObject} />
      <CustomDialog
        id='revertDialog'
        title={t('WorkflowHistory.Dialog.Revert', { timeStamp })}
        maxWidth='xs'
        open={revertDialog}
        showActions
        onYes={handleRevertWorkflow}
        onClose={toggleRevertDialog}
        textDialogYes={t('Dialog.Yes')}
        textDialogNo={t('Dialog.No')}
      />
      <CompareDefinitionDialog
        open={compareDialog}
        onToggleDialog={handleToggleCompare}
        definition={history.definition}
        currentDefinition={workflow}
      />
    </>
  )
}

WorkflowHistoryItem.propTypes = {
  onRevert: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLatest: PropTypes.bool.isRequired,
  workflow: PropTypes.object
}

export default WorkflowHistoryItem
