import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import EventHandlerDataCard from './EventHandlerDataCard'
import ActionListCard from './actions/ActionListCard'
import StandardHeader from 'components/layout/StandardHeader.js'
import { useHeader } from 'providers/AreasProvider'
import { useMutation } from '@apollo/client'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useToast } from '@totalsoft/rocket-ui'
import { ADD_EVENT_HANDLER_MUTATION } from '../mutations/AddEventHandlerMutation'
import { UPDATE_EVENT_HANDLER_MUTATION } from '../mutations/UpdateEventHandlerMutation'
import { isDirty, isPropertyDirty } from '@totalsoft/change-tracking'
import { generateModelForSaving, updateCacheList } from 'features/eventHandler/common/functions'
import { queryLimit } from 'features/common/constants'
import { EVENT_HANDLER_LIST_QUERY } from 'features/eventHandler/list/queries/EventHandlerListQuery'
import { buildValidator } from '../validator'
import { useDirtyFieldValidation } from '@totalsoft/pure-validations-react'
import { get, useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { EVENT_HANDLERS_QUERY } from '../queries/EventHandlersQuery'
import { handlerConfig } from 'features/eventHandler/common/constants'
import { emptyArray } from 'utils/constants'

const EventHandlerContainer = () => {
  const { t } = useTranslation()
  const history = useNavigate()
  const [, setHeader] = useHeader(<StandardHeader />)
  const showError = useError()
  const addToast = useToast()
  const { name, event, new: paramNew } = useParams()

  const isNew = paramNew === 'new'
  const clientQuery = useClientQueryWithErrorHandling()

  const [handlerLens, dirtyInfo, resetHandler] = useChangeTrackingLens(handlerConfig)
  const handler = handlerLens |> get

  const { data } = useQueryWithErrorHandling(EVENT_HANDLER_LIST_QUERY, { variables: { limit: queryLimit } })

  const handlerValidator = useMemo(() => buildValidator(data?.eventHandlerList, name), [data?.eventHandlerList, name])
  const [validation, validate, resetValidation] = useDirtyFieldValidation(handlerValidator)

  const { loading } = useQueryWithErrorHandling(EVENT_HANDLERS_QUERY, {
    variables: { name, event, activeOnly: false, isNew },
    onCompleted: handlerData => {
      const current = handlerData?.eventHandler
      resetHandler(current)
    }
  })

  const editInProgress = handler?.actions?.some(s => s?.editMode)

  const updateCacheAfterEdit = async () => {
    try {
      await clientQuery(EVENT_HANDLERS_QUERY, {
        variables: { name, event, activeOnly: false, isNew },
        fetchPolicy: 'network-only'
      })
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
      const newCollection = [handler, ...(existingHandlers?.eventHandlerList || emptyArray)]
      updateCacheList(cache, { limit: queryLimit }, newCollection)
    } catch (error) {
      console.log(error)
    }
  }

  const [addHandler, { loading: adding }] = useMutation(ADD_EVENT_HANDLER_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      resetValidation()
      history(`/eventHandlers/${handler?.event}/${handler?.name}`)
    },
    onError: error => showError(error),
    update: updateCacheAfterAdd
  })

  const [updateHandler, { loading: updating }] = useMutation(UPDATE_EVENT_HANDLER_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      resetValidation()
      if (isPropertyDirty('event', dirtyInfo)) history(`/eventHandlers/${handler?.event}/${handler?.name}`)
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
