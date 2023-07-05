import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Card, Typography } from '@totalsoft/rocket-ui'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'

import styles from '../../styles'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined'
import moment from 'moment'
import ExecutionActions from './ExecutionActions'

const useStyles = makeStyles(styles)

const ExecutionSummary = ({ workflowId, execution, startPolling }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const startTimeMoment = moment(execution?.startTime || new Date())
  const endTimeMoment = moment(execution?.endTime || new Date())
  const totalTime = endTimeMoment.diff(startTimeMoment) / 1000

  return (
    <Grid container alignItems='center' spacing={3}>
      <Grid item xs={6} md={2}>
        <Card icon={AccessTimeIcon}>
          <>
            <Typography display='block' className={classes.primaryText}>
              {t('Execution.TotalTime')}
            </Typography>
            <Typography>{totalTime}</Typography>
          </>
        </Card>
      </Grid>

      <Grid item xs={6} md={3}>
        <Card icon={PlayCircleOutlineIcon}>
          <>
            <Typography display='block' className={classes.primaryText}>
              {t('Execution.StartTime')}
            </Typography>
            <Typography>
              {t('DATE_FORMAT', { date: execution?.startTime ? { value: execution?.startTime, format: 'DD-MM-YYYY HH:mm:ss' } : '-' })}
            </Typography>
          </>
        </Card>
      </Grid>

      <Grid item xs={6} md={3}>
        <Card icon={CheckCircleOutlineOutlinedIcon}>
          <>
            <Typography display='block' className={classes.primaryText}>
              {t('Execution.EndTime')}
            </Typography>
            <Typography>
              {t('DATE_FORMAT', { date: execution?.endTime ? { value: execution?.endTime, format: 'DD-MM-YYYY HH:mm:ss' } : '-' })}
            </Typography>
          </>
        </Card>
      </Grid>
      <Grid item xs={6} md={2}>
        <Card icon={StarBorderOutlinedIcon}>
          {' '}
          <>
            <Typography display='block' className={classes.primaryText}>
              {t('Execution.Status')}
            </Typography>
            <Typography>{execution?.status ?? '-'}</Typography>
          </>
        </Card>
      </Grid>
      <Grid item xs={6} md={2}>
        <Card icon={RadioButtonCheckedOutlinedIcon}>
          <>
            <Typography display='block' className={classes.primaryText}>
              {t('Execution.Actions')}
            </Typography>
            <ExecutionActions
              status={execution?.status}
              workflowId={workflowId}
              startPolling={startPolling}
              readOnly={execution?.readOnly || false}
            />
          </>
        </Card>
      </Grid>
    </Grid>
  )
}

ExecutionSummary.propTypes = {
  workflowId: PropTypes.string.isRequired,
  execution: PropTypes.object.isRequired,
  startPolling: PropTypes.func.isRequired
}

export default ExecutionSummary
