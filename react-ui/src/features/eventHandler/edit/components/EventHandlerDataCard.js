import React from 'react'
import PropTypes from 'prop-types'
import { IconCard, LoadingFakeText } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Info } from '@mui/icons-material'
import EventHandlerData from './EventHandlerData'
import { useTranslation } from 'react-i18next'

const EventHandlerDataCard = ({ loading, handlerLens, dirtyInfo, validation }) => {
  const { t } = useTranslation()

  if (loading) return <LoadingFakeText lines={3} />

  return (
    <IconCard
      icon={Info}
      title={t('EventHandler.EventHandlerInfo')}
      content={<EventHandlerData handlerLens={handlerLens} dirtyInfo={dirtyInfo} validation={validation} />}
    />
  )
}

EventHandlerDataCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  handlerLens: PropTypes.object.isRequired,
  dirtyInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  validation: PropTypes.object.isRequired
}

export default EventHandlerDataCard
