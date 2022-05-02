import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import WorkflowExecutionList from './WorkflowExecutionList'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { EXECUTION_LIST_QUERY } from 'features/execution/list/queries/ExecutionListQuery'
import { sortStartTimeDesc } from 'features/common/constants'
import { executionStatus } from 'features/execution/list/constants/executionStatusList'
import { generateFreeText } from 'features/execution/common/functions'

const WorkflowExecutionListContainer = ({ workflowName, version, displayData }) => {
  const { data, loading, startPolling, stopPolling } = useQueryWithErrorHandling(EXECUTION_LIST_QUERY, {
    variables: { freeText: generateFreeText({ workflowType: workflowName, version }, true), sort: sortStartTimeDesc },
    skip: !displayData || !workflowName
  })
  const executionList = data?.getExecutionList?.results

  useEffect(() => {
    if (!executionList) return
    if (executionList.find(e => e.status === executionStatus.RUNNING)) startPolling(1000)
    else stopPolling()
  }, [executionList, startPolling, stopPolling, workflowName])

  return <WorkflowExecutionList loading={loading} executionList={executionList} startPolling={startPolling} />
}

WorkflowExecutionListContainer.propTypes = {
  workflowName: PropTypes.string,
  version: PropTypes.number.isRequired,
  displayData: PropTypes.bool.isRequired
}

export default WorkflowExecutionListContainer
