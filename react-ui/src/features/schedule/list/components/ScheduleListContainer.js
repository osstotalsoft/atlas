import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import React, { useCallback, useState } from 'react'
import { SCHEDULE_LIST_QUERY } from '../queries/ScheduleListQueries'
import { DELETE_SCHEDULE_MUTATION } from '../mutations/DeleteSchedule'
import { sortBy } from 'utils/functions'
import { defaults } from 'apollo/defaultCacheData'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { tasksPager } from 'apollo/cacheKeyFunctions'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { emptyArray } from 'utils/constants'
import { sortingDirection, sortTaskByField } from 'features/common/constants'
import { pipe } from 'ramda'
import ScheduleList from './ScheduleList'

const ScheduleListContainer = () => {
  const history = useHistory()

  const defaultPager = defaults[tasksPager]
  const [pager, setPager] = useState(defaultPager)
  const showError = useError()
  const { t } = useTranslation()
  const addToast = useToast()

  const { loading, data, refetch } = useQueryWithErrorHandling(SCHEDULE_LIST_QUERY)

  const [deleteSchedule] = useMutation(DELETE_SCHEDULE_MUTATION, {
    onCompleted: () => {
      addToast(t('General.DeletingSucceeded'), 'success')
    },
    onError: error => showError(error),
    refetchQueries: [
      {
        query: SCHEDULE_LIST_QUERY
      }
    ]
  })

  const handleEditSchedule = useCallback(
    schedule => {
      history.push(`/schedule/${schedule?.name}`)
    },
    [history]
  )
  const handleAddSchedule = useCallback(() => {
    history.push('/schedule/new')
  }, [history])

  const handleDeleteRow = useCallback(name => {
    deleteSchedule({ variables: { name } })
  }, [deleteSchedule])
  return (
    <>
      <ScheduleList
        pager={pager}
        setPager={setPager}
        loading={loading}
        list={pipe(sortBy(sortTaskByField, sortingDirection.DESC))(data?.scheduleList || emptyArray)}
        onEdit={handleEditSchedule}
        onAdd={handleAddSchedule}
        onRefresh={refetch}
        onDelete={handleDeleteRow}
      />
    </>
  )
}

export default ScheduleListContainer
