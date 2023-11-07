import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import WorkflowList from './WorkflowList'
import WorkflowListFilter from './WorkflowListFilter'
import { WORKFLOW_LIST_QUERY, WORKFLOW_EXPORT_QUERY } from '../queries/WorkflowListQuery'
import { DELETE_WORKFLOW_MUTATION } from '../mutations/DeleteWorkflowMutation'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { filterList, sortBy, validateEmail } from 'utils/functions'
import { fieldsToBeRemoved, sortingDirection, sortWorkflowsByField } from 'features/common/constants'
import { defaults } from 'apollo/defaultCacheData'
import { workflowsPager } from 'apollo/cacheKeyFunctions'
import { useMutation } from '@apollo/client'
import { useToast } from '@totalsoft/rocket-ui'
import { useNavigate } from 'react-router-dom'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { WORKFLOW_QUERY } from 'features/workflow/edit/queries/WorkflowQuery'
import { updateCacheList } from 'features/workflow/common/functions'
import { pipe } from 'ramda'
import { emptyArray, emptyString } from 'utils/constants'
import { CREATE_UPDATE_WORKFLOW_MUTATION } from 'features/workflow/edit/mutations/CreateOrUpdateWorkflowMutation'
import omitDeep from 'omit-deep-lodash'
import { useLazyQuery } from '@apollo/client'
import ExportDialog from './ExportDialog'
import ImportDialog from './ImportDialog'
import { IMPORT_WORKFLOW_MUTATION } from '../mutations/ImportMutation'
import { useApolloLocalStorage } from 'hooks/apolloLocalStorage'
import { workflowListFilter } from 'apollo/cacheKeyFunctions'

const WorkflowListContainer = () => {
  const { t } = useTranslation()
  const addToast = useToast()
  const showError = useError()
  const history = useNavigate()
  const { oidcUser } = useReactOidc()

  const defaultPager = defaults[workflowsPager]
  const [pager, setPager] = useState(defaultPager)
  const [exportModal, setExportModal] = useState(false)
  const [exportData, setExportData] = useState('')
  const [importModal, setImportModal] = useState(false)
  const [importData, setImportData] = useState('')
  const [tenantCode, setTenantCode] = useState('')

  const { loading, data, refetch } = useQueryWithErrorHandling(WORKFLOW_LIST_QUERY)
  const [getWorkflowsForExport] = useLazyQuery(WORKFLOW_EXPORT_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: result => {
      setExportModal(true)
      setExportData(result.exportWorkflows.data)
      setTenantCode(result.exportWorkflows.tenantCode)
    }
  })

  const [importWorkflows] = useMutation(IMPORT_WORKFLOW_MUTATION, {
    onCompleted: () => {
      refetch()
      setImportModal(false)
    },
    onError: error => showError(error)
  })

  const handleImport = useCallback(
    (input, replacements) => {
      importWorkflows({ variables: { input, replacements } })
    },
    [importWorkflows]
  )

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

  const handleEditWorkflow = useCallback((name, version) => history(`/workflows/${name}/${version}`), [history])

  const handleAddWorkflow = useCallback(() => {
    history('/workflows/new')
  }, [history])

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
              ownerEmail: validateEmail(oidcUser?.profile.preferred_username) ? oidcUser?.profile.preferred_username : 'example@email.com',
              timeoutSeconds: workflow?.timeoutSeconds || 0,
              updatedBy: emptyString,
              createTime: new Date().getTime()
            }
          }
        })
    },
    [clientQuery, createWorkflow, oidcUser?.profile.name, oidcUser?.profile.preferred_username]
  )

  const onExportButton = useCallback(
    workflowList => {
      getWorkflowsForExport({
        variables: { workflowList }
      })
    },
    [getWorkflowsForExport]
  )

  const onCloseExportModal = useCallback(() => setExportModal(false), [setExportModal])
  const onCloseImportModal = useCallback(() => {
    setImportModal(false)
    refetch()
  }, [setImportModal, refetch])

  const onImport = useCallback(
    event => {
      const file = event.target.files[0]

      const reader = new FileReader()
      reader.addEventListener(
        'loadend',
        _event => {
          setImportData(_event.target.result)
          setImportModal(true)
          _event.target.value = ''
        },
        false
      )

      reader.readAsText(file)
    },
    [setImportData]
  )

  return (
    <>
      {importModal && <ImportDialog data={importData} open={importModal} onClose={onCloseImportModal} onImport={handleImport} />}
      {exportData && <ExportDialog data={exportData} open={exportModal} onClose={onCloseExportModal} tenantCode={tenantCode} />}
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
        onExportButton={onExportButton}
        onImport={onImport}
      />
    </>
  )
}

export default WorkflowListContainer
