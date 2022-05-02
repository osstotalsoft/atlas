import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import React, { useCallback, useState } from 'react'
import { TASK_LIST_QUERY } from '../queries/TaskListQuery'
import TaskList from './TaskList'
import { filterList } from 'utils/functions'
import { taskListFilter } from 'apollo/cacheKeyFunctions'
import TaskListFilter from './TaskListFilter'
import { useApolloLocalStorage } from 'hooks/apolloLocalStorage'
import { DELETE_TASK_DEF_MUTATION } from '../mutations/DeleteTaskDef'
import { defaults } from 'apollo/defaultCacheData'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { tasksPager } from 'apollo/cacheKeyFunctions'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'

const TasksListContainer = () => {
  const history = useHistory()

  const defaultPager = defaults[tasksPager]
  const [pager, setPager] = useState(defaultPager)
  const showError = useError()
  const { t } = useTranslation()
  const addToast = useToast()

  const handleEditTask = useCallback(name => history.push({ pathname: `/tasks/${name}` }), [history])
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
      <TaskListFilter loading={loading} filters={filters} onChangeFilters={handleChangeFilters} />
      <TaskList
        pager={pager}
        setPager={setPager}
        loading={loading}
        taskList={filterList(filters)(data?.getTaskDefinitionList)}
        onEditTask={handleEditTask}
        onAddTask={handleAddTask}
        onRefresh={refetch}
        onDeleteRow={handleDeleteRow}
      />
    </>
  )
}

export default TasksListContainer
