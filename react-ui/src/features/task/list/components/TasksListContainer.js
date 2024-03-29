import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import React, { useCallback, useState } from 'react'
import { TASK_LIST_QUERY } from '../queries/TaskListQuery'
import TaskList from './TaskList'
import { filterList, sortBy } from 'utils/functions'
import TaskListFilter from './TaskListFilter'
import { DELETE_TASK_DEF_MUTATION } from '../mutations/DeleteTaskDef'
import { defaults } from 'apollo/defaultCacheData'
import { useToast } from '@totalsoft/rocket-ui'
import { tasksPager } from 'apollo/cacheKeyFunctions'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { emptyArray } from 'utils/constants'
import { sortingDirection, sortTaskByField } from 'features/common/constants'
import { pipe } from 'ramda'

const TasksListContainer = () => {
  const history = useNavigate()

  const defaultPager = defaults[tasksPager]
  const [pager, setPager] = useState(defaultPager)
  const showError = useError()
  const { t } = useTranslation()
  const addToast = useToast()

  const handleEditTask = useCallback(name => history({ pathname: `/tasks/${name}` }), [history])
  const { loading, data, refetch } = useQueryWithErrorHandling(TASK_LIST_QUERY)
  const [filters, setFilters] = useState({})
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
    history('/tasks/new')
  }, [history])

  const handleDeleteRow = useCallback(
    name => {
      deleteTask({ variables: { name } })
    },
    [deleteTask]
  )
  return (
    <>
      <TaskListFilter loading={loading} filters={filters} onChangeFilters={handleChangeFilters} />
      <TaskList
        pager={pager}
        setPager={setPager}
        loading={loading}
        taskList={pipe(filterList(filters), sortBy(sortTaskByField, sortingDirection.DESC))(data?.getTaskDefinitionList || emptyArray)}
        onEditTask={handleEditTask}
        onAddTask={handleAddTask}
        onRefresh={refetch}
        onDeleteRow={handleDeleteRow}
      />
    </>
  )
}

export default TasksListContainer
