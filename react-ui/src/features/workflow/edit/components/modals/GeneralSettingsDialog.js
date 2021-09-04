import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { CustomDialog } from '@bit/totalsoft_oss.react-mui.kit.core'
import GeneralSettingsModal from './GeneralSettingsModal'

const GeneralSettingsDialog = ({ open, onClose, onYes, workflowLens }) => {
  const { t } = useTranslation()

  return (
    <CustomDialog
      id='generalSettings'
      open={open}
      showActions
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
