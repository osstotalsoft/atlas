import React from 'react'
import PropTypes from 'prop-types'
import { Card, FakeText } from '@totalsoft/rocket-ui'
import { Info } from '@mui/icons-material'
import EventHandlerData from './EventHandlerData'
import { useTranslation } from 'react-i18next'

const EventHandlerDataCard = ({ loading, handlerLens, dirtyInfo, validation }) => {
  const { t } = useTranslation()

  if (loading) return <FakeText lines={3} />

  return (
    <Card icon={Info} title={t('EventHandler.EventHandlerInfo')}>
      <EventHandlerData handlerLens={handlerLens} dirtyInfo={dirtyInfo} validation={validation} />
    </Card>
  )
}

EventHandlerDataCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  handlerLens: PropTypes.object.isRequired,
  dirtyInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  validation: PropTypes.object.isRequired
}

export default EventHandlerDataCard
