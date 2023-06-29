import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  Undo,
  Redo,
  DescriptionOutlined,
  SettingsOutlined
} from '@mui/icons-material'
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import styles from '../styles/styles'

const useStyles = makeStyles(styles)

const UtilitiesBar = ({ isNew, isDirty, onExecute, onPreviewJson, onDelete, onShowSettings, onImport, onExport, onUndo, onRedo }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [confirmation, setConfirmation] = useState(true)

  const handleSelectFile = useCallback(
    event => {
      const file = event.target.files[0]
      onImport(file)
    },
    [onImport]
  )
  const handleAskConfirmation = useCallback(() => {
    if (isDirty) {
      const confirm = window.confirm(t('Designer.ImportConfirmation'))
      setConfirmation(confirm)
    }
  }, [isDirty, t])

  return (
    <Paper id='utilities-bar' className={classes.utilitiesBar}>
      <Grid container direction='row'>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Undo')} onClick={onUndo}>
          <Undo />
        </IconButton>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Redo')} onClick={onRedo}>
          <Redo />
        </IconButton>
        <label htmlFor='contained-button-file'>
          <IconButton
            color={'themeNoBackground'}
            variant='contained'
            component='span'
            tooltip={t('Designer.UtilitiesBar.Import')}
            onClick={handleAskConfirmation}
          >
            <CloudUploadOutlined />
          </IconButton>
          {confirmation && (
            <input accept='application/txt,application/json' id='contained-button-file' type='file' hidden onChange={handleSelectFile} />
          )}
        </label>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Export')} onClick={onExport}>
          <CloudDownloadOutlined />
        </IconButton>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.PreviewJson')} onClick={onPreviewJson}>
          <DescriptionOutlined />
        </IconButton>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Delete')} onClick={onDelete}>
          <DeleteOutlined />
        </IconButton>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Execute')} onClick={onExecute} disabled={isNew}>
          <PlayCircleIcon />
        </IconButton>
        <IconButton
          id='workflowSettings'
          color={'themeNoBackground'}
          tooltip={t('Designer.UtilitiesBar.GeneralSettings')}
          onClick={onShowSettings}
        >
          <SettingsOutlined />
        </IconButton>
      </Grid>
    </Paper>
  )
}

UtilitiesBar.propTypes = {
  isNew: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  onExecute: PropTypes.func.isRequired,
  onPreviewJson: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired
}

export default UtilitiesBar
