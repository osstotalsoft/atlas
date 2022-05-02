import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { IconCard, Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Grid, makeStyles } from '@material-ui/core'

import styles from '../../styles'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import RadioButtonCheckedOutlinedIcon from '@material-ui/icons/RadioButtonCheckedOutlined'
import moment from 'moment'
import ExecutionActions from './ExecutionActions'

const useStyles = makeStyles(styles)

const ExecutionSummary = ({ summary, workflowId, execution, startPolling }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const startTimeMoment = moment(execution?.startTime || new Date())
  const endTimeMoment = moment(execution?.endTime || new Date())
  const totalTime = endTimeMoment.diff(startTimeMoment) / 1000

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
              <ExecutionActions status={execution?.status} workflowId={workflowId} startPolling={startPolling} />
            </>
          }
        />
      </Grid>
    </Grid>
  )
}

ExecutionSummary.propTypes = {
  summary: PropTypes.object.isRequired,
  workflowId: PropTypes.string.isRequired,
  execution: PropTypes.object.isRequired,
  startPolling: PropTypes.func.isRequired
}

export default ExecutionSummary
