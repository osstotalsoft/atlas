import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import WorkflowHistoryList from './WorkflowHistoryList'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { WORKFLOW_HISTORY_QUERY } from '../queries/WorkflowHistoryQuery'
import { useMutation } from '@apollo/client'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'utils/functions'
import { fieldsToBeRemoved, sortHistoryByField, sortingDirection } from 'features/common/constants'
import { emptyArray } from 'utils/constants'
import { WORKFLOW_QUERY } from 'features/workflow/edit/queries/WorkflowQuery'
import { CREATE_UPDATE_WORKFLOW_MUTATION } from 'features/workflow/edit/mutations/CreateOrUpdateWorkflowMutation'
import omitDeep from 'omit-deep-lodash'

const WorkflowHistoryListContainer = ({ workflow, displayData }) => {
  const addToast = useToast()
  const showError = useError()
  const { t } = useTranslation()
  const clientQuery = useClientQueryWithErrorHandling()

  const { data, loading } = useQueryWithErrorHandling(WORKFLOW_HISTORY_QUERY, {
    variables: { workflowName: workflow?.name, version: workflow?.version },
    skip: !displayData || !workflow?.name
  })

  const historyList = data?.workflowHistory?.values

  const updateCacheAfterRevert = async () => {
    try {
      await clientQuery(WORKFLOW_QUERY, {
        variables: { name: workflow?.name, version: workflow?.version, skip: false },
        fetchPolicy: 'network-only'
      })

      await clientQuery(WORKFLOW_HISTORY_QUERY, {
        variables: { workflowName: workflow?.name, version: workflow?.version, skip: false },
        fetchPolicy: 'network-only'
      })
    } catch (error) {
      console.log(error)
    }
  }

  const [revert] = useMutation(CREATE_UPDATE_WORKFLOW_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
    },
    onError: error => showError(error),
    update: updateCacheAfterRevert
  })

  const handleRevert = useCallback(
    async input => {
      revert({
        variables: { input: omitDeep(input, fieldsToBeRemoved) }
      })
    },
    [revert]
  )

  return (
    <WorkflowHistoryList
      workflow={workflow}
      historyList={sortBy(sortHistoryByField, sortingDirection.DESC, historyList || emptyArray)}
      loading={loading}
      onRevert={handleRevert}
    />
  )
}

WorkflowHistoryListContainer.propTypes = {
  workflow: PropTypes.object,
  displayData: PropTypes.bool.isRequired
}

export default WorkflowHistoryListContainer
