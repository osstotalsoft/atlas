import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { AddButton, CardTitle, IconCard } from '@bit/totalsoft_oss.react-mui.kit.core'
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed'
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
    <IconCard
      icon={DynamicFeedIcon}
      title={
        <CardTitle
          title={t('EventHandler.Actions')}
          actions={[
            <AddButton
              key='addButton'
              color={'theme'}
              title={t('EventHandler.Buttons.AddAction')}
              onClick={handleAddAction}
              disabled={editInProgress}
            />
          ]}
        />
      }
      content={<ActionList handlerLens={handlerLens} editInProgress={editInProgress} validation={validation} />}
    />
  )
}

ActionListCard.propTypes = {
  handlerLens: PropTypes.object.isRequired,
  editInProgress: PropTypes.bool,
  validation: PropTypes.object.isRequired
}

export default ActionListCard
