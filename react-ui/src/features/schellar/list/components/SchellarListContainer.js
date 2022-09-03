import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import React, { useCallback, useState } from 'react'
import { SCHELLAR_LIST_QUERY } from '../queries/SchellarListQueries'
import { DELETE_SCHELLAR_MUTATION } from '../mutations/DeleteSchellar'
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
import SchellarList from './SchellarList'

const SchellarListContainer = () => {
  const history = useHistory()

  const defaultPager = defaults[tasksPager]
  const [pager, setPager] = useState(defaultPager)
  const showError = useError()
  const { t } = useTranslation()
  const addToast = useToast()

  const { loading, data, refetch } = useQueryWithErrorHandling(SCHELLAR_LIST_QUERY)

  const [deleteSchedule] = useMutation(DELETE_SCHELLAR_MUTATION, {
    onCompleted: () => {
      addToast(t('General.DeletingSucceeded'), 'success')
    },
    onError: error => showError(error),
    refetchQueries: [
      {
        query: SCHELLAR_LIST_QUERY
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
      <SchellarList
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

export default SchellarListContainer
