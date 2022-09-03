import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch } from 'react-router-dom'
import StandardHeader from 'components/layout/StandardHeader.js'
import { useHeader } from 'providers/AreasProvider'
import { useMutation } from '@apollo/client'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { ADD_SCHEDULE_MUTATION, UPDATE_SCHEDULE_MUTATION } from '../mutations/ScheduleMutations'
import { SCHELLAR_QUERY } from '../queries/ScheduleQuery'
import { WORKFLOW_LIST_QUERY } from 'features/workflow/list/queries/WorkflowListQuery'
import { SCHELLAR_LIST_QUERY } from 'features/schellar/list/queries/SchellarListQueries'
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
  toDate: new Date()
}

const ScheduleContainer = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const match = useRouteMatch()
  const [, setHeader] = useHeader(<StandardHeader />)
  const showError = useError()
  const addToast = useToast()

  const { name } = match.params
  const isNew = match.params.new === 'new'
  const clientQuery = useClientQueryWithErrorHandling()

  const [scheduleLens, dirtyInfo, resetschedule] = useChangeTrackingLens(scheduleConfig)
  const schedule = scheduleLens |> get

  const { data: workflows } = useQueryWithErrorHandling(WORKFLOW_LIST_QUERY, { variables: { limit: queryLimit } })
  const { data: schedules } = useQueryWithErrorHandling(SCHELLAR_LIST_QUERY, { variables: { limit: queryLimit } })

  const scheduleValidator = useMemo(() => buildValidator(schedules?.scheduleList, name), [schedules?.scheduleList, name])
  const [validation, validate, resetValidation] = useDirtyFieldValidation(scheduleValidator)

  const editInProgress = schedule?.actions?.some(s => s?.editMode)

  const { loading } = useQueryWithErrorHandling(SCHELLAR_QUERY, {
    variables: { name, isNew },
    onCompleted: data => {
      const current = data?.schedule
      resetschedule({ ...current, workflowContext: JSON.stringify(current.workflowContext, undefined, 2) })
    }
  })

  const updateCacheAfterEdit = async () => {
    try {
      await clientQuery(SCHELLAR_LIST_QUERY, {
        variables: { name, isNew },
        fetchPolicy: 'network-only'
      })

      await clientQuery(SCHELLAR_QUERY, {
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
        query: SCHELLAR_LIST_QUERY,
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
      history.push(`/schedule/${schedule?.name}`)
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
