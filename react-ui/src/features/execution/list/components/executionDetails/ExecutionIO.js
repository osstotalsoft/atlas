import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Grid, Paper, makeStyles } from '@material-ui/core'
import Typography from '@bit/totalsoft_oss.react-mui.typography'
import styles from '../../styles'

const useStyles = makeStyles(styles)

const ExecutionIO = ({ executionDetails }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Grid container alignItems='stretch'>
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper} square>
          <Typography align='center' variant='h6'>
            {t('Execution.Input')}
          </Typography>
          <pre className={classes.pre}>{executionDetails?.input ? JSON.stringify(executionDetails?.input, null, 3) : ' '}</pre>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper} square>
          <Typography align='center' variant='h6'>
            {t('Execution.Output')}
          </Typography>
          <pre className={classes.pre}>{executionDetails?.output ? JSON.stringify(executionDetails?.output, null, 3) : ' '}</pre>
        </Paper>
      </Grid>
    </Grid>
  )
}

ExecutionIO.propTypes = {
  executionDetails: PropTypes.object.isRequired
}

export default ExecutionIO
