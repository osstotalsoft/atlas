import React from 'react'
import PropTypes from 'prop-types'
import { Box, Grid, Typography } from '@mui/material'
import { executionStatus } from 'features/execution/list/constants/executionStatusList'
import { useTranslation } from 'react-i18next'

const DiagramTaskSummaryHeader = ({ selectedTask }) => {
  const { t } = useTranslation()

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Box border={1}>
          <Typography display='block' align='center' color={selectedTask?.status == executionStatus.FAILED ? 'error' : 'inherit'}>
            {`${t('Execution.Task.RefName')}: ${selectedTask?.workflowTask?.taskReferenceName}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box border={1}>
          <Typography display='block' align='center' color={selectedTask?.status == executionStatus.FAILED ? 'error' : 'inherit'}>
            {`${t('Execution.Task.PollCount')} : ${selectedTask?.pollCount}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box border={1}>
          <Typography display='block' align='center' color={selectedTask?.status == executionStatus.FAILED ? 'error' : 'inherit'}>
            {`${t('Execution.Task.CallAfter')}: ${selectedTask?.callbackAfterSeconds}`}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

DiagramTaskSummaryHeader.propTypes = {
  selectedTask: PropTypes.object.isRequired
}

export default DiagramTaskSummaryHeader
