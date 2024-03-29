import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { makeStyles } from '@mui/styles'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next'
import WorkflowExecutionItem from './WorkflowExecutionItem'
import { FakeText } from '@totalsoft/rocket-ui'
import { useNavigate } from 'react-router'

const useStyles = makeStyles(styles)

const WorkflowExecutionList = ({ loading, executionList, startPolling }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const history = useNavigate()

  const handleSeeDetails = useCallback(
    workflowId => {
      history({ pathname: `/executions/${workflowId}` })
    },
    [history]
  )

  if (loading) return <FakeText lines={6} />
  return (
    <Table className={classes.table}>
      <Thead>
        <Tr>
          <Th className={classes.tableHeader}>{t('Execution.WorkflowId')}</Th>
          <Th className={classes.tableHeader}>{t('Execution.EndTime')}</Th>
          <Th className={classes.tableHeader}>{t('Execution.Status')}</Th>
          <Th className={classes.tableHeader} />
        </Tr>
      </Thead>
      <Tbody>
        {executionList?.map(execution => (
          <WorkflowExecutionItem
            key={execution?.workflowId}
            execution={execution}
            onSeeDetails={handleSeeDetails}
            startPolling={startPolling}
          />
        ))}
      </Tbody>
    </Table>
  )
}

WorkflowExecutionList.propTypes = {
  loading: PropTypes.bool.isRequired,
  executionList: PropTypes.array,
  startPolling: PropTypes.func.isRequired
}

export default WorkflowExecutionList
