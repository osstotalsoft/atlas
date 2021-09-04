import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import WorkflowList from './WorkflowList'
import WorkflowListFilter from './WorkflowListFilter'
import { WORKFLOW_LIST_QUERY } from '../queries/WorkflowListQuery'
import { DELETE_WORKFLOW_MUTATION } from '../mutations/DeleteWorkflowMutation'
import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useApolloLocalStorage } from 'hooks/apolloLocalStorage'
import { workflowListFilter } from 'apollo/cacheKeyFunctions'
import { filterList } from 'utils/functions'
import { queryLimit } from 'features/common/constants'
import { defaults } from 'apollo/defaultCacheData'
import { workflowsPager } from 'apollo/cacheKeyFunctions'
import { useMutation } from '@apollo/client'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useHistory } from 'react-router-dom'

const WorkflowListContainer = () => {
  const { t } = useTranslation()
  const addToast = useToast()
  const showError = useError()
  const history = useHistory()

  const defaultPager = defaults[workflowsPager]
  const [pager, setPager] = useState(defaultPager)

  const { loading, data, refetch } = useQueryWithErrorHandling(WORKFLOW_LIST_QUERY, { variables: { limit: queryLimit } })
  const [filters, setFilters] = useApolloLocalStorage(workflowListFilter)

  const [deleteWorkflow] = useMutation(DELETE_WORKFLOW_MUTATION, {
    onCompleted: () => {
      addToast(t('General.DeletingSucceeded'), 'success')
    },
    onError: error => showError(error),
    refetchQueries: [
      {
        query: WORKFLOW_LIST_QUERY,
        variables: { limit: queryLimit }
      }
    ]
  })

  const handleChangeFilters = useCallback(
    (prop, value) => {
      setFilters(current => ({ ...current, [prop]: value })), []
      setPager(currentPager => ({ ...currentPager, page: 0 })) //reset pager
    },
    [setFilters]
  )

  const handleEditWorkflow = useCallback(name => history.push(`/workflows/${name}`), [history])

  const handleAddWorkflow = useCallback(() => history.push('/workflows/new'), [history])

  const handleDeleteWorkflow = useCallback((name, version) => deleteWorkflow({ variables: { name, version } }), [deleteWorkflow])

  return (
    <>
      <WorkflowListFilter loading={loading} filters={filters} onChangeFilters={handleChangeFilters} />
      <WorkflowList
        pager={pager}
        setPager={setPager}
        loading={loading}
        workflowList={filterList(filters)(data?.getAll)}
        onEditWorkflow={handleEditWorkflow}
        onAddWorkflow={handleAddWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
        onRefresh={refetch}
      />
    </>
  )
}

export default WorkflowListContainer
