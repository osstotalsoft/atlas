import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Paper } from '@material-ui/core'
import { IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import {
  DescriptionOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  Undo,
  Redo,
  FileCopyOutlined,
  SettingsOutlined
} from '@material-ui/icons'
import PlayCircleIcon from '@material-ui/icons/PlayCircleOutline'
import { Grid } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import styles from '../styles/styles'

const useStyles = makeStyles(styles)

const UtilitiesBar = ({ isNew, isDirty, onExecute, onClone, onDelete, onShowSettings, onImport, onExport }) => {
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
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Undo')}>
          <Undo />
        </IconButton>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Redo')}>
          <Redo />
        </IconButton>
        <IconButton
          color={'themeNoBackground'}
          variant='contained'
          component='label'
          onClick={handleAskConfirmation}
          tooltip={t('Designer.UtilitiesBar.Import')}
          disabled={!isNew}
        >
          <DescriptionOutlined />
          {confirmation && <input type='file' accept='application/txt,application/json' hidden onChange={handleSelectFile} />}
        </IconButton>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Export')} onClick={onExport}>
          <CloudDownloadOutlined />
        </IconButton>
        <IconButton color={'themeNoBackground'} tooltip={t('Designer.UtilitiesBar.Clone')} onClick={onClone}>
          <FileCopyOutlined />
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
  onClone: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
}

export default UtilitiesBar
