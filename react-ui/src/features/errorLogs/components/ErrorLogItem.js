import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Grid, makeStyles, Paper } from '@material-ui/core'
import { Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import styles from '../styles'

const useStyles = makeStyles(styles)

const ErrorLogItem = ({ log }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Grid container className={classes.container} spacing={2} alignItems='stretch'>
      <Grid item xs={12} sm={6} lg={5}>
        <Paper elevation={1} className={classes.paper}>
          <Typography variant={'body2'} className={classes.primaryText}>{t('Log.Message')}</Typography>
          <Typography>{log?.message}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Paper elevation={1} className={classes.paper}>
          <Typography variant={'body2'} className={classes.primaryText}>{t('Log.RequestId')}</Typography>
          <Typography>{log?.requestId}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Paper elevation={1} className={classes.paper}>
          <Typography variant={'body2'} className={classes.primaryText}>{t('Log.Code')}</Typography>
          <Typography>{log?.code}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={1} className={classes.paper}>
          <Typography variant={'body2'} className={classes.primaryText}>{t('Log.Details')}</Typography>
          <Typography>{log?.details}</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

ErrorLogItem.propTypes = {
  log: PropTypes.object.isRequired
}

export default ErrorLogItem
