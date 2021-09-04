import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch } from 'react-router-dom'
import EventHandlerDataCard from './EventHandlerDataCard'
import ActionListCard from './actions/ActionListCard'
import StandardHeader from 'components/layout/StandardHeader.js'
import { useHeader } from 'providers/AreasProvider'
import { useMutation } from '@apollo/client'
import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { ADD_EVENT_HANDLER_MUTATION } from '../mutations/AddEventHandlerMutation'
import { UPDATE_EVENT_HANDLER_MUTATION } from '../mutations/UpdateEventHandlerMutation'
import { isDirty } from '@totalsoft/change-tracking'
import { generateModelForSaving, updateCacheList } from 'features/eventHandler/common/functions'
import { queryLimit } from 'features/common/constants'
import { EVENT_HANDLER_LIST_QUERY } from 'features/eventHandler/list/queries/EventHandlerListQuery'
import { buildValidator } from '../validator'
import { useDirtyFieldValidation } from '@totalsoft/pure-validations-react'
import { get, useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { EVENT_HANDLERS_QUERY } from '../queries/EventHandlersQuery'
import { handlerConfig } from 'features/eventHandler/common/constants'

const EventHandlerContainer = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const match = useRouteMatch()
  const [, setHeader] = useHeader(<StandardHeader />)
  const showError = useError()
  const addToast = useToast()

  const { name, event } = match.params
  const isNew = match.params.new === 'new'

  const [handlerLens, dirtyInfo, resetHandler] = useChangeTrackingLens(handlerConfig)
  const handler = handlerLens |> get

  const { data } = useQueryWithErrorHandling(EVENT_HANDLER_LIST_QUERY, { variables: { limit: queryLimit } })

  const handlerValidator = useMemo(() => buildValidator(data?.getEventHandlers, name), [data?.getEventHandlers, name])
  const [validation, validate, resetValidation] = useDirtyFieldValidation(handlerValidator)

  const { loading } = useQueryWithErrorHandling(EVENT_HANDLERS_QUERY, {
    variables: { event, activeOnly: false, isNew },
    onCompleted: data => {
      const handler = data?.getEventHandlersForSink?.find(h => h.name === name)
      resetHandler(handler)
    }
  })

  const editInProgress = handler?.actions?.some(s => s?.editMode)

  const updateCacheAfterEdit = async cache => {
    try {
      const existingHandlers = cache.readQuery({
        query: EVENT_HANDLER_LIST_QUERY,
        variables: { limit: queryLimit }
      })
      const newCollection = [handler, ...existingHandlers?.getEventHandlers.filter(w => w.name !== handler?.name)]
      updateCacheList(cache, { limit: queryLimit }, newCollection)
    } catch (error) {
      console.log(error)
    }
  }

  const updateCacheAfterAdd = async cache => {
    try {
      const existingHandlers = cache.readQuery({
        query: EVENT_HANDLER_LIST_QUERY,
        variables: { limit: queryLimit }
      })
      const newCollection = [handler, ...existingHandlers?.getEventHandlers]
      updateCacheList(cache, { limit: queryLimit }, newCollection)
    } catch (error) {
      console.log(error)
    }
  }

  const [addHandler, { loading: adding }] = useMutation(ADD_EVENT_HANDLER_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      resetValidation()
      history.push(`/eventHandlers/${handler?.event}/${handler?.name}`)
    },
    onError: error => showError(error),
    update: updateCacheAfterAdd
  })

  const [updateHandler, { loading: updating }] = useMutation(UPDATE_EVENT_HANDLER_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      resetValidation()
    },
    onError: error => showError(error),
    update: updateCacheAfterEdit
  })

  const handleSave = useCallback(() => {
    if (!validate(handler)) return

    const eventHandlerInput = handler |> generateModelForSaving
    isNew ? addHandler({ variables: { eventHandlerInput } }) : updateHandler({ variables: { eventHandlerInput } })
  }, [addHandler, handler, isNew, updateHandler, validate])

  useEffect(() => {
    validate(handler, dirtyInfo)
  }, [dirtyInfo, validate, handler])

  useEffect(() => {
    setHeader(
      <StandardHeader
        headerText={name}
        path='/eventHandlers'
        onSave={handleSave}
        saving={adding || updating}
        disableSaving={!isDirty(dirtyInfo) || editInProgress}
      />
    )
  }, [adding, dirtyInfo, editInProgress, handleSave, name, setHeader, updating])

  return (
    <>
      <EventHandlerDataCard loading={loading} handlerLens={handlerLens} validation={validation} />
      <ActionListCard handlerLens={handlerLens} editInProgress={editInProgress} validation={validation?.actions} />
    </>
  )
}

export default EventHandlerContainer
