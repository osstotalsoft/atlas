import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Card } from '@totalsoft/rocket-ui'
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'
import ActionList from './ActionList'
import { useTranslation } from 'react-i18next'
import { over } from '@totalsoft/react-state-lens'
import { append } from 'ramda'

const ActionListCard = ({ handlerLens, editInProgress, validation }) => {
  const { t } = useTranslation()

  const handleAddAction = useCallback(() => {
    over(handlerLens?.actions, append({ editMode: true }))
  }, [handlerLens?.actions])

  return (
    <Card
      icon={DynamicFeedIcon}
      title={t('EventHandler.Actions')}
      actions={[
        <IconButton
          key='addButton'
          color='secondary'
          type='add'
          title={t('EventHandler.Buttons.AddAction')}
          onClick={handleAddAction}
          disabled={editInProgress}
        />
      ]}
    >
      <ActionList handlerLens={handlerLens} editInProgress={editInProgress} validation={validation} />
    </Card>
  )
}

ActionListCard.propTypes = {
  handlerLens: PropTypes.object.isRequired,
  editInProgress: PropTypes.bool,
  validation: PropTypes.object.isRequired
}

export default ActionListCard
