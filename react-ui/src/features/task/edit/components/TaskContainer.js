import React, { useCallback, useEffect, useMemo } from 'react'
import { useChangeTrackingLens, get } from '@totalsoft/change-tracking-react'
import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { SAVE_TASK_MUTATION } from '../mutations/SaveTaskMutation'
import { useToast } from '@totalsoft/rocket-ui'
import { TASK_QUERY } from '../queries/TaskQuery.js'
import { isDirty, isPropertyDirty } from '@totalsoft/change-tracking'
import { useParams, useNavigate } from 'react-router'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import Task from './Task'
import { queryLimit as limit } from '../../../common/constants'
import defaultConfiguration from '../../common/defaultConfiguration'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { buildValidator } from '../validator'
import { useDirtyFieldValidation } from '@totalsoft/pure-validations-react'
import { omit } from 'ramda'
import { TASK_LIST_QUERY } from '../../list/queries/TaskListQuery'
import { TASK_NAMES_QUERY } from '../queries/TaskNamesQuery'

const TaskContainer = () => {
  const showError = useError()
  const addToast = useToast()
  const history = useNavigate()
  const { new: paramNew } = useParams()
  const name = paramNew
  const { t } = useTranslation()

  const isNew = paramNew === 'new'
  const { oidcUser } = useReactOidc()

  const [taskLens, dirtyInfo, resetTask] = useChangeTrackingLens(defaultConfiguration)
  const task = taskLens |> get

  const { loading } = useQueryWithErrorHandling(TASK_QUERY, {
    variables: { name },
    skip: isNew,
    onCompleted: taskData => {
      resetTask({ ...taskData?.getTaskDefinition, inputTemplate: JSON.stringify(taskData?.getTaskDefinition.inputTemplate, null, '\t') })
    }
  })

  const { data } = useQueryWithErrorHandling(TASK_NAMES_QUERY, { variables: { limit } })

  const timeoutPolicyList = ['RETRY', 'TIME_OUT_WF', 'ALERT_ONLY']
  const retryLogicList = ['FIXED', 'EXPONENTIAL_BACKOFF', 'LINEAR_BACKOFF']

  const taskValidator = useMemo(() => buildValidator(data?.getTaskDefs, name), [data?.getTaskDefs, name])
  const [validation, validate, resetValidation] = useDirtyFieldValidation(taskValidator)

  const [saveTask, { loading: saving }] = useMutation(SAVE_TASK_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      resetValidation()
      resetTask(task)
      if (isNew || isPropertyDirty('name', dirtyInfo)) history(`/tasks/${task?.name}`)
    },
    onError: error => showError(error),
    refetchQueries: [{ query: TASK_QUERY, variables: { name: task?.name } }, { query: TASK_LIST_QUERY }]
  })

  const handleSave = useCallback(() => {
    if (!validate(task)) return

    if (isNew)
      saveTask({
        variables: {
          input: [
            {
              ...omit(['readOnly'], { ...task, inputTemplate: JSON.parse(task.inputTemplate) }),
              createTime: new Date().getTime(),
              ownerEmail: oidcUser?.profile.preferred_username
            }
          ]
        }
      })
    else saveTask({ variables: { input: omit(['readOnly'], { ...task, inputTemplate: JSON.parse(task.inputTemplate) }) } })
  }, [isNew, oidcUser?.profile.preferred_username, saveTask, task, validate])

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
