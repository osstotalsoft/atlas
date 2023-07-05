import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Dialog } from '@totalsoft/rocket-ui'
import GeneralSettingsModal from './GeneralSettingsModal'

const GeneralSettingsDialog = ({ open, onClose, onYes, workflowLens }) => {
  const { t } = useTranslation()

  return (
    <Dialog
      id='generalSettings'
      open={open}
      textDialogYes={t('General.Buttons.Save')}
      textDialogNo={t('General.Buttons.Cancel')}
      onClose={onClose}
      onYes={onYes}
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
