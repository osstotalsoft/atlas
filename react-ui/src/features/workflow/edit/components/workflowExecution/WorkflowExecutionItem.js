import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Td, Tr } from 'react-super-responsive-table'
import { Typography } from '@totalsoft/rocket-ui'
import { makeStyles } from '@mui/styles'
import tableStyle from 'assets/jss/components/tableStyle'
import ExecutionActions from 'features/execution/list/components/executionDetails/ExecutionActions'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(tableStyle)

const WorkflowExecutionItem = ({ execution, onSeeDetails, startPolling }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleClick = useCallback(() => {
    onSeeDetails(execution?.workflowId)
  }, [execution?.workflowId, onSeeDetails])

  return (
    <Tr>
      <Td className={classes.tableContent}>
        <a onClick={handleClick}>
          <Typography>{execution?.workflowId}</Typography>
        </a>
      </Td>
      <Td className={classes.tableContent}>
        <Typography>{t('DATE_FORMAT', { date: { value: execution?.endTime, format: 'DD-MM-YY HH:mm:ss' } }) || '-'}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <Typography>{execution?.status}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <ExecutionActions
          workflowId={execution?.workflowId}
          status={execution?.status}
          startPolling={startPolling}
          readOnly={execution?.readOnly || false}
        />
      </Td>
    </Tr>
  )
}

WorkflowExecutionItem.propTypes = {
  execution: PropTypes.object,
  onSeeDetails: PropTypes.func.isRequired,
  startPolling: PropTypes.func.isRequired
}

export default WorkflowExecutionItem
