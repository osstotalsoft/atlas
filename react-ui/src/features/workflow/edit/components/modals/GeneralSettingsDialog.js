import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Dialog } from '@totalsoft/rocket-ui'
import GeneralSettingsModal from './GeneralSettingsModal'
import { Button } from '@totalsoft/rocket-ui'

const GeneralSettingsDialog = ({ open, onClose, onYes, workflowLens }) => {
  const { t } = useTranslation()

  return (
    <Dialog
      id='generalSettings'
      open={open}
      actions={[
        <Button key={1} color='primary' size='small' style={{ marginRight: '20px' }} onClick={onYes}>
          {t('General.Buttons.Save')}
        </Button>,
        <Button key={2} color='primary' size='small' onClick={onClose}>
          {t('General.Buttons.Cancel')}
        </Button>
      ]}
      title={t('Designer.UtilitiesBar.GeneralSettings')}
      maxWidth='md'
      disableBackdropClick
      disableEscapeKeyDown
      content={<GeneralSettingsModal workflowLens={workflowLens} />}
    />
  )
}

GeneralSettingsDialog.propTypes = {
  workflowLens: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default GeneralSettingsDialog
