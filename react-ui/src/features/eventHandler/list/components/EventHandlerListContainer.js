import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EventHandlerList from './EventHandlerList'
import EventHandlerListFilter from './EventHandlerListFilter'
import { filterList } from 'utils/functions'
import { EVENT_HANDLER_LIST_QUERY } from '../queries/EventHandlerListQuery'
import { DELETE_EVENT_HANDLER_MUTATION } from '../mutations/DeleteEventHandlerMutation'
import { useToast } from '@totalsoft/rocket-ui'
import { queryLimit } from 'features/common/constants'
import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useMutation } from '@apollo/client'
import { defaults } from 'apollo/defaultCacheData'
import { eventHandlersPager } from 'apollo/cacheKeyFunctions'
import { useNavigate } from 'react-router-dom'

const defaultPager = defaults[eventHandlersPager]

const EventHandlerListContainer = () => {
  const { t } = useTranslation()
  const history = useNavigate()
  const addToast = useToast()
  const showError = useError()

  const { loading, data, refetch } = useQueryWithErrorHandling(EVENT_HANDLER_LIST_QUERY, {
    variables: { limit: queryLimit }
  })
  const [filters, setFilters] = useState({})
  const [pager, setPager] = useState(defaultPager)

  const [deleteHandler] = useMutation(DELETE_EVENT_HANDLER_MUTATION, {
    onCompleted: () => {
      addToast(t('General.DeletingSucceeded'), 'success')
    },
    onError: error => showError(error),
    refetchQueries: [{ query: EVENT_HANDLER_LIST_QUERY, variables: { limit: queryLimit } }]
  })

  const handleChangeFilters = useCallback(
    (prop, value) => {
      setFilters(current => ({ ...current, [prop]: value }))
      setPager(currentPager => ({ ...currentPager, page: 0 }))
    },
    [setFilters]
  )

  const handleDeleteHandler = useCallback(
    name => {
      deleteHandler({ variables: { name } })
    },
    [deleteHandler]
  )

  const handleEditHandler = useCallback(
    handler => {
      history(`/eventHandlers/${handler?.event}/${handler?.name}`)
    },
    [history]
  )

  const handleAddHandler = useCallback(() => history('/eventHandlers/new'), [history])

  return (
    <>
      <EventHandlerListFilter loading={loading} filters={filters} onChangeFilters={handleChangeFilters} />
      <EventHandlerList
        pager={pager}
        setPager={setPager}
        onRefresh={refetch}
        onDeleteHandler={handleDeleteHandler}
        onEditHandler={handleEditHandler}
        onAddHandler={handleAddHandler}
        handlerList={filterList(filters)(data?.eventHandlerList)}
        loading={loading}
      />
    </>
  )
}

export default EventHandlerListContainer
