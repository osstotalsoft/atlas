import React, { useCallback, useEffect, useState } from 'react'
import ExecutionList from './ExecutionList'
import ExecutionListFilter from './ExecutionListFilter'
import LoadingFakeText from '@bit/totalsoft_oss.react-mui.fake-text'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { EXECUTION_LIST_QUERY } from '../queries/ExecutionListQuery'
import { executionsFilter, executionsPager } from 'apollo/cacheKeyFunctions'
import { defaults } from 'apollo/defaultCacheData'
import { useApolloLocalStorage } from 'hooks/apolloLocalStorage'
import { emptyArray, emptyObject, emptyString } from 'utils/constants'
import { generateFreeText } from '../../common/functions'
import { useHistory } from 'react-router-dom'
import { sortStartTimeDesc } from 'features/common/constants'
import { executionStatus } from '../constants/executionStatusList'

const defaultPager = defaults[executionsPager]

const ExecutionListContainer = () => {
  const [pager, setPager] = useApolloLocalStorage(executionsPager)
  const history = useHistory()
  const [filters, setFilters] = useApolloLocalStorage(executionsFilter)
  const [freeText, setFreeText] = useState(emptyString)

  const { loading, data, refetch, startPolling, stopPolling } = useQueryWithErrorHandling(EXECUTION_LIST_QUERY, {
    variables: { size: pager.pageSize, start: freeText ? 0 : pager.start, freeText, sort: sortStartTimeDesc }
  })
  const executionList = data?.search1?.results

  const handleRowsPerPageChange = useCallback(
    pageSize => setPager({ ...defaultPager, pageSize: parseInt(pageSize, 10), start: pageSize * defaultPager.page }),
    [setPager]
  )

  const handleSeeDetails = useCallback(
    execution => {
      history.push({ pathname: `/executions/${execution?.workflowId}` })
    },
    [history]
  )
  const handlePageChange = useCallback(
    page => {
      setPager(currentPager => ({ ...currentPager, page, start: page * currentPager.pageSize }))
    },
    [setPager]
  )

  const handleApplyFilters = useCallback(
    newFilters => {
      setFilters(newFilters)
      setPager(currentPager => ({ ...currentPager, page: 0 }))
      setFreeText(generateFreeText(newFilters))
    },
    [setFilters, setPager]
  )

  const handleResetFilters = useCallback(() => {
    setFilters(emptyObject)
    setFreeText(emptyString)
  }, [setFilters])

  useEffect(() => {
    if (data?.search1 && pager?.totalCount !== data?.search1?.totalHits)
      setPager(currentPager => ({ ...currentPager, totalCount: data?.search1?.totalHits }))
  }, [data, pager?.totalCount, setPager])

  useEffect(() => {
    if (!executionList) return
    if (executionList.find(e => e.status === executionStatus.RUNNING)) startPolling(1000)
    else stopPolling()
  }, [executionList, startPolling, stopPolling])

  if (loading) return <LoadingFakeText lines={10} />

  return (
    <>
      <ExecutionListFilter filters={filters} onApplyFilters={handleApplyFilters} onResetFilters={handleResetFilters} />
      <ExecutionList
        loading={loading}
        executionList={executionList ?? emptyArray}
        onSeeDetails={handleSeeDetails}
        pager={pager}
        setPager={setPager}
        onRowsPerPageChange={handleRowsPerPageChange}
        onPageChange={handlePageChange}
        onRefresh={refetch}
      />
    </>
  )
}

export default ExecutionListContainer
