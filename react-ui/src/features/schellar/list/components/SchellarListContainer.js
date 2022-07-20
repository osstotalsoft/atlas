import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import React, { useCallback, useState } from 'react'
import { SCHELLAR_LIST_QUERY } from '../queries/SchellarListQueries'
import { filterList, sortBy } from 'utils/functions'
import { taskListFilter } from 'apollo/cacheKeyFunctions'
import TaskListFilter from './TaskListFilter'
import { useApolloLocalStorage } from 'hooks/apolloLocalStorage'
import { defaults } from 'apollo/defaultCacheData'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { tasksPager } from 'apollo/cacheKeyFunctions'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { emptyArray } from 'utils/constants'
import { sortingDirection, sortTaskByField } from 'features/common/constants'
import { pipe } from 'ramda'

const SchellarListContainer = () => {
  const history = useHistory()

  const defaultPager = defaults[tasksPager]
  const [pager, setPager] = useState(defaultPager)
  const showError = useError()
  const { t } = useTranslation()
  const addToast = useToast()

  const { loading, data, refetch } = useQueryWithErrorHandling(TASK_LIST_QUERY)
  const [filters, setFilters] = useApolloLocalStorage(taskListFilter)

  const [deleteTask] = useMutation(DELETE_TASK_DEF_MUTATION, {
    onCompleted: () => {
      addToast(t('General.DeletingSucceeded'), 'success')
    },
    onError: error => showError(error),
    refetchQueries: [
      {
        query: TASK_LIST_QUERY
      }
    ]
  })

  const handleChangeFilters = useCallback(
    (prop, value) => {
      setFilters(current => ({ ...current, [prop]: value }))
      setPager(currentPager => ({ ...currentPager, page: 0 })) //reset pager
    },
    [setFilters]
  )

  const handleAddTask = useCallback(() => {
    history.push('/tasks/new')
  }, [history])

  const handleDeleteRow = useCallback(
    name => {
      deleteTask({ variables: { name } })
    },
    [deleteTask]
  )
  return (
    <>
      <SchellarListFilters loading={loading} filters={filters} onChangeFilters={handleChangeFilters} />
      <SchellarList
        pager={pager}
        setPager={setPager}
        loading={loading}
        list={pipe(filterList(filters), sortBy(sortTaskByField, sortingDirection.DESC))(data?.getSchedules || emptyArray)}
        onEditTask={handleEditSchedule}
        onAddTask={handleAddSchedule}
        onRefresh={refetch}
        onDeleteRow={handleDeleteRow}
      />
    </>
  )
}

export default SchellarListContainer
