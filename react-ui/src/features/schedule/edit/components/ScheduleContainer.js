import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import StandardHeader from 'components/layout/StandardHeader.js'
import { useHeader } from 'providers/AreasProvider'
import { useMutation } from '@apollo/client'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useToast } from '@totalsoft/rocket-ui'
import { ADD_SCHEDULE_MUTATION, UPDATE_SCHEDULE_MUTATION } from '../mutations/ScheduleMutations'
import { SCHEDULE_QUERY } from '../queries/ScheduleQuery'
import { WORKFLOW_LIST_QUERY } from 'features/workflow/list/queries/WorkflowListQuery'
import { SCHEDULE_LIST_QUERY } from 'features/schedule/list/queries/ScheduleListQueries'
import { isDirty } from '@totalsoft/change-tracking'
import { queryLimit } from 'features/common/constants'
import { buildValidator } from '../validator'
import { useDirtyFieldValidation } from '@totalsoft/pure-validations-react'
import { get, useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { emptyArray } from 'utils/constants'
import ScheduleData from './ScheduleData'
import { updateCacheList } from '../../common/functions'

export const scheduleConfig = {
  name: '',
  enabled: true,
  cronString: '*/30 * * * *',
  parallelRuns: false,
  workflowVersion: '1',
  fromDate: new Date(),
  toDate: new Date(),
  workflowContext: '{}'
}

const ScheduleContainer = () => {
  const { t } = useTranslation()
  const history = useNavigate()
  const { new: name } = useParams()
  const [, setHeader] = useHeader(<StandardHeader />)
  const showError = useError()
  const addToast = useToast()

  const isNew = name === 'new'
  const clientQuery = useClientQueryWithErrorHandling()

  const [scheduleLens, dirtyInfo, resetschedule] = useChangeTrackingLens(scheduleConfig)
  const schedule = scheduleLens |> get

  const { data: workflows } = useQueryWithErrorHandling(WORKFLOW_LIST_QUERY, { variables: { limit: queryLimit } })
  const { data: schedules } = useQueryWithErrorHandling(SCHEDULE_LIST_QUERY, { variables: { limit: queryLimit } })

  const scheduleValidator = useMemo(() => buildValidator(schedules?.scheduleList, name), [schedules?.scheduleList, name])
  const [validation, validate, resetValidation] = useDirtyFieldValidation(scheduleValidator)

  const editInProgress = schedule?.actions?.some(s => s?.editMode)

  const { loading } = useQueryWithErrorHandling(SCHEDULE_QUERY, {
    variables: { name, isNew },
    onCompleted: data => {
      const current = data?.schedule
      resetschedule({ ...current, workflowContext: JSON.stringify(current.workflowContext, undefined, 2) })
    }
  })

  const updateCacheAfterEdit = async () => {
    try {
      await clientQuery(SCHEDULE_LIST_QUERY, {
        variables: { name, isNew },
        fetchPolicy: 'network-only'
      })

      await clientQuery(SCHEDULE_QUERY, {
        variables: { name, isNew },
        fetchPolicy: 'network-only'
      })
    } catch (error) {
      console.log(error)
    }
  }

  const updateCacheAfterAdd = async cache => {
    try {
      const existingschedules = cache.readQuery({
        query: SCHEDULE_LIST_QUERY,
        variables: { limit: queryLimit }
      })
      const newCollection = [schedule, ...(existingschedules?.eventscheduleList || emptyArray)]
      updateCacheList(cache, { limit: queryLimit }, newCollection)
    } catch (error) {
      console.log(error)
    }
  }

  const [addschedule, { loading: adding }] = useMutation(ADD_SCHEDULE_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      resetValidation()
      history(`/schedule/${schedule?.name}`)
    },
    onError: error => showError(error),
    update: updateCacheAfterAdd
  })

  const [updateschedule, { loading: updating }] = useMutation(UPDATE_SCHEDULE_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      resetValidation()
    },
    onError: error => showError(error),
    update: updateCacheAfterEdit
  })

  const handleSave = useCallback(() => {
    if (!validate(schedule)) return

    const scheduleInput = { ...schedule, workflowContext: JSON.parse(schedule.workflowContext) }
    isNew ? addschedule({ variables: { scheduleInput } }) : updateschedule({ variables: { name: schedule.name, scheduleInput } })
  }, [addschedule, schedule, isNew, updateschedule, validate])

  useEffect(() => {
    validate(schedule, dirtyInfo)
  }, [dirtyInfo, validate, schedule])

  useEffect(() => {
    setHeader(
      <StandardHeader
        headerText={name}
        path='/schedule'
        onSave={handleSave}
        saving={adding || updating}
        disableSaving={!isDirty(dirtyInfo) || editInProgress}
      />
    )
  }, [adding, dirtyInfo, editInProgress, handleSave, name, setHeader, updating])

  if (loading) return <Fragment></Fragment>

  return (
    <>
      <ScheduleData
        workflows={
          workflows?.getWorkflowList?.map(a => {
            return {
              name: `${a.name}/${a.version}`
            }
          }) || emptyArray
        }
        loading={loading}
        scheduleLens={scheduleLens}
        validation={validation}
      />
    </>
  )
}

export default ScheduleContainer
