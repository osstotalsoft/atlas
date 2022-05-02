import React, { useCallback, useEffect, useMemo } from 'react'
import { useChangeTrackingLens, get } from '@totalsoft/change-tracking-react'
import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { SAVE_TASK_MUTATION } from '../mutations/SaveTaskMutation'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { TASK_QUERY } from '../queries/TaskQuery.js'
import { TIMEOUT_POLICY_OPTIONS } from '../queries/TimeoutPolicyListQuery'
import { RETRY_LOGIC_OPTIONS } from '../queries/RetryLogicListQuery'
import { isDirty, isPropertyDirty } from '@totalsoft/change-tracking'
import { useRouteMatch, useHistory } from 'react-router'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import Task from './Task'
import { queryLimit as limit } from '../../../common/constants'
import { emptyArray } from 'utils/constants'
import defaultConfiguration from '../../common/defaultConfiguration'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { buildValidator } from '../validator'
import { useDirtyFieldValidation } from '@totalsoft/pure-validations-react'
import { omit } from 'ramda'
import { TASK_LIST_QUERY } from '../../list/queries/TaskListQuery'

const TaskContainer = () => {
  const showError = useError()
  const addToast = useToast()
  const history = useHistory()
  const match = useRouteMatch()
  const { t } = useTranslation()
  const name = match.params.name
  const isNew = match.params.new === 'new'
  const { oidcUser } = useReactOidc()

  const [taskLens, dirtyInfo, resetTask] = useChangeTrackingLens(defaultConfiguration)
  const task = taskLens |> get

  const { data, loading } = useQueryWithErrorHandling(TASK_QUERY, {
    variables: { name, isNew, limit },
    onCompleted: taskData => {
      resetTask(taskData?.getTaskDefinition)
    }
  })
  const { data: timeoutPoliciesData } = useQueryWithErrorHandling(TIMEOUT_POLICY_OPTIONS)
  const timeoutPolicyList = timeoutPoliciesData?.__type?.enumValues || emptyArray

  const { data: retryLogicData } = useQueryWithErrorHandling(RETRY_LOGIC_OPTIONS)
  const retryLogicList = retryLogicData?.__type?.enumValues || emptyArray

  const taskValidator = useMemo(() => buildValidator(data?.getTaskDefs, name), [data?.getTaskDefs, name])
  const [validation, validate, resetValidation] = useDirtyFieldValidation(taskValidator)

  const [saveTask, { loading: saving }] = useMutation(SAVE_TASK_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      resetValidation()
      resetTask(task)
      if (isNew || isPropertyDirty('name', dirtyInfo)) history.push(`/tasks/${task?.name}`)
    },
    onError: error => showError(error),
    refetchQueries: [{ query: TASK_QUERY, variables: { name, isNew, limit } }, { query: TASK_LIST_QUERY }]
  })

  const handleSave = useCallback(() => {
    if (!validate(task)) return

    if (isNew)
      saveTask({
        variables: {
          input: [{ ...omit(['readOnly'], task), createTime: new Date().getTime(), ownerEmail: oidcUser.profile.preferred_username }]
        }
      })
    else saveTask({ variables: { input: omit(['readOnly'], task) } })
  }, [isNew, oidcUser.profile.preferred_username, saveTask, task, validate])

  useEffect(() => {
    validate(task, dirtyInfo)
  }, [dirtyInfo, validate, task])

  return (
    <Task
      taskLens={taskLens}
      validation={validation}
      loading={loading}
      isDirty={isDirty(dirtyInfo)}
      onSave={handleSave}
      saving={saving}
      timeoutPolicyList={timeoutPolicyList}
      retryLogicList={retryLogicList}
    />
  )
}

export default TaskContainer
