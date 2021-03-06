import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import WorkflowList from './WorkflowList'
import WorkflowListFilter from './WorkflowListFilter'
import { WORKFLOW_LIST_QUERY } from '../queries/WorkflowListQuery'
import { DELETE_WORKFLOW_MUTATION } from '../mutations/DeleteWorkflowMutation'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useApolloLocalStorage } from 'hooks/apolloLocalStorage'
import { workflowListFilter } from 'apollo/cacheKeyFunctions'
import { filterList, sortBy } from 'utils/functions'
import { fieldsToBeRemoved, sortingDirection, sortWorkflowsByField } from 'features/common/constants'
import { defaults } from 'apollo/defaultCacheData'
import { workflowsPager } from 'apollo/cacheKeyFunctions'
import { useMutation } from '@apollo/client'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useHistory } from 'react-router-dom'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { WORKFLOW_QUERY } from 'features/workflow/edit/queries/WorkflowQuery'
import { updateCacheList } from 'features/workflow/common/functions'
import { pipe } from 'ramda'
import { emptyArray, emptyString } from 'utils/constants'
import { CREATE_UPDATE_WORKFLOW_MUTATION } from 'features/workflow/edit/mutations/CreateOrUpdateWorkflowMutation'
import omitDeep from 'omit-deep-lodash'

const WorkflowListContainer = () => {
  const { t } = useTranslation()
  const addToast = useToast()
  const showError = useError()
  const history = useHistory()
  const { oidcUser } = useReactOidc()

  const defaultPager = defaults[workflowsPager]
  const [pager, setPager] = useState(defaultPager)

  const { loading, data, refetch } = useQueryWithErrorHandling(WORKFLOW_LIST_QUERY)
  const [filters, setFilters] = useApolloLocalStorage(workflowListFilter)
  const [cloneName, setCloneName] = useState()
  const [cloneVersion, setCloneVersion] = useState()
  const clientQuery = useClientQueryWithErrorHandling()

  const updateCacheAfterAdd = async cache => {
    try {
      const { data: updatedData } = await clientQuery(WORKFLOW_QUERY, {
        variables: { name: cloneName, version: cloneVersion, skip: false }
      })

      updateCacheList(cache, updatedData?.getWorkflow)
    } catch (error) {
      console.log(error)
    }
  }

  const [createWorkflow] = useMutation(CREATE_UPDATE_WORKFLOW_MUTATION, {
    onCompleted: () => {
      addToast(t('Workflow.Notification.ClonedSuccessfully'), 'success')
    },
    update: updateCacheAfterAdd,
    onError: error => showError(error)
  })

  const [deleteWorkflow] = useMutation(DELETE_WORKFLOW_MUTATION, {
    onCompleted: () => {
      addToast(t('General.DeletingSucceeded'), 'success')
    },
    onError: error => showError(error),
    refetchQueries: [
      {
        query: WORKFLOW_LIST_QUERY
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

  const handleEditWorkflow = useCallback((name, version) => history.push(`/workflows/${name}/${version}`), [history])

  const handleAddWorkflow = useCallback(() => history.push('/workflows/new'), [history])

  const handleDeleteWorkflow = useCallback((name, version) => deleteWorkflow({ variables: { name, version } }), [deleteWorkflow])

  const handleCloneWorkflow = useCallback(
    async (name, version, futureCloneName, futureCloneVersion) => {
      setCloneName(futureCloneName)
      setCloneVersion(futureCloneVersion)
      const { data: queryData } = await clientQuery(WORKFLOW_QUERY, {
        variables: { name, version, skip: false },
        notifyOnNetworkStatusChange: true
      })

      const workflow = queryData?.getWorkflow
      workflow &&
        createWorkflow({
          variables: {
            input: {
              ...omitDeep(workflow, fieldsToBeRemoved),
              name: futureCloneName,
              version: futureCloneVersion,
              createdBy: oidcUser?.profile.name,
              ownerEmail: oidcUser?.profile.preferred_username,
              timeoutSeconds: workflow?.timeoutSeconds || 0,
              updatedBy: emptyString,
              createTime: new Date().getTime()
            }
          }
        })
    },
    [clientQuery, createWorkflow, oidcUser?.profile.name, oidcUser?.profile.preferred_username]
  )

  return (
    <>
      <WorkflowListFilter loading={loading} filters={filters} onChangeFilters={handleChangeFilters} />
      <WorkflowList
        pager={pager}
        setPager={setPager}
        loading={loading}
        workflowList={pipe(filterList(filters), sortBy(sortWorkflowsByField, sortingDirection.DESC))(data?.getWorkflowList || emptyArray)}
        onEditWorkflow={handleEditWorkflow}
        onAddWorkflow={handleAddWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
        onCloneWorkflow={handleCloneWorkflow}
        onRefresh={refetch}
      />
    </>
  )
}

export default WorkflowListContainer
