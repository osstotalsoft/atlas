import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { IconButton, IconCard, Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Grid, makeStyles } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import PauseIcon from '@material-ui/icons/Pause'
import ReplayIcon from '@material-ui/icons/Replay'
import RepeatIcon from '@material-ui/icons/Repeat'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import styles from '../../styles'
import { executionStatus } from '../../constants/executionStatusList'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import RadioButtonCheckedOutlinedIcon from '@material-ui/icons/RadioButtonCheckedOutlined'
import moment from 'moment'

const useStyles = makeStyles(styles)

const ExecutionSummary = ({ summary, execution, onRestart, onRetry, onResume, onTerminate, onPause }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const startTimeMoment = moment(execution?.startTime || new Date())
  const endTimeMoment = moment(execution?.endTime || new Date())
  const totalTime = endTimeMoment.diff(startTimeMoment) / 1000

  const actionButtons = status => {
    switch (status) {
      case executionStatus.TERMINATED:
      case executionStatus.FAILED:
        return (
          <Grid container>
            <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Restart')} onClick={onRestart}>
              <RepeatIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Retry')} onClick={onRetry}>
              <ReplayIcon fontSize='small' />
            </IconButton>
          </Grid>
        )
      case executionStatus.PAUSED:
        return (
          <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Resume')} onClick={onResume}>
            <PlayArrowIcon fontSize='small' />
          </IconButton>
        )
      case executionStatus.RUNNING:
        return (
          <Grid container>
            <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Terminate')} onClick={onTerminate}>
              <CloseIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Pause')} onClick={onPause}>
              <PauseIcon fontSize='small' />
            </IconButton>
          </Grid>
        )
      default:
        return <Typography>{t('Execution.NoActions')}</Typography>
    }
  }

  return (
    <Grid container alignItems='center' spacing={3}>
      <Grid item xs={6} md={2}>
        <IconCard
          icon={AccessTimeIcon}
          content={
            <>
              <Typography display='block' className={classes.primaryText}>
                {t('Execution.TotalTime')}
              </Typography>
              <Typography>{summary?.executionTime ? summary?.executionTime / 1000 : totalTime}</Typography>
            </>
          }
        />
      </Grid>

      <Grid item xs={6} md={3}>
        <IconCard
          icon={PlayCircleOutlineIcon}
          content={
            <>
              <Typography display='block' className={classes.primaryText}>
                {t('Execution.StartTime')}
              </Typography>
              <Typography>
                {t('DATE_FORMAT', { date: summary?.startTime ? { value: summary?.startTime, format: 'DD-MM-YYYY HH:mm:ss' } : '-' })}
              </Typography>
            </>
          }
        />
      </Grid>

      <Grid item xs={6} md={3}>
        <IconCard
          icon={CheckCircleOutlineOutlinedIcon}
          content={
            <>
              <Typography display='block' className={classes.primaryText}>
                {t('Execution.EndTime')}
              </Typography>
              <Typography>
                {t('DATE_FORMAT', { date: execution?.endTime ? { value: execution?.endTime, format: 'DD-MM-YYYY HH:mm:ss' } : '-' })}
              </Typography>
            </>
          }
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <IconCard
          icon={StarBorderOutlinedIcon}
          content={
            <>
              <Typography display='block' className={classes.primaryText}>
                {t('Execution.Status')}
              </Typography>
              <Typography>{execution?.status ?? '-'}</Typography>
            </>
          }
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <IconCard
          icon={RadioButtonCheckedOutlinedIcon}
          content={
            <>
              <Typography display='block' className={classes.primaryText}>
                {t('Execution.Actions')}
              </Typography>
              {actionButtons(execution?.status)}
            </>
          }
        />
      </Grid>
    </Grid>
  )
}

ExecutionSummary.propTypes = {
  summary: PropTypes.object.isRequired,
  execution: PropTypes.object.isRequired,
  onRestart: PropTypes.func.isRequired,
  onResume: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  onTerminate: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired
}

export default ExecutionSummary
